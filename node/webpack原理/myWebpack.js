
const fs = require('fs')
const path = require('path')
const parser = require("@babel/parser")
const t = require('@babel/types')
const traverse = require('@babel/traverse')
const generate = require('@babel/generator').default;
const config = require('./webpack.config')
const ejs = require('ejs')

const EXPORT_DEFAULT_FUN = `
__webpack_require__.d(__webpack_exports__, {
   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
});\n
`;

const ESMODULE_TAG_FUN = `
__webpack_require__.r(__webpack_exports__);\n
`;

function parseFile(file) {
    // 读取入口文件
    const fileContent = fs.readFileSync(file, "utf-8");

    // 使用babel parser解析AST
    const ast = parser.parse(fileContent, { sourceType: "module" });

    let importFilePath = "";

    let importVarName = new Map()

    let importCovertVarName = new Map()

    let hasExport = false

    // 使用babel traverse来遍历ast上的节点
    traverse.default(ast, {
        ImportDeclaration(p) {
            const importFile = p.node.source.value
            importFilePath = path.join(path.dirname(config.entry), importFile)
            importFilePath = importFilePath.replace(/\\/g, '\/')
            importFilePath = `./${importFilePath}.js`
            // console.log(importFilePath)
            // importVarName.set() = p.node.specifiers.local
            p.node.specifiers.forEach(item => {
                // console.log(item)
                importVarName.set(item.local.name, item.local.name)
                importCovertVarName.set(item.local.name, `__${item.local.name}__WEBPACK_IMPORTED_MODULE_0__`)
            })
            const variableDeclaration = t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(
                        `__${path.basename(importFile)}__WEBPACK_IMPORTED_MODULE_0__`
                    ),
                    t.callExpression(t.identifier("__webpack_require__"), [
                        t.stringLiteral(importFilePath),
                    ])
                ),
            ])
            // console.log(variableDeclaration)
            p.replaceWith(variableDeclaration)
        },
        CallExpression(p) {
            // 如果调用的是import进来的函数
            if (importVarName.has(p.node.callee.name)) {
                // 就将它替换为转换后的函数名字
                p.node.callee.name = `${importCovertVarName.get(p.node.callee.name)}.default`;
            }
        },
        Identifier(p) {
            // 如果调用的是import进来的变量
            if (importVarName.has(p.node.name)) {
                // 就将它替换为转换后的函数名字
                p.node.name = `${importCovertVarName.get(p.node.name)}.default`;
            }
        },
        ExportDefaultDeclaration(p) {
            hasExport = true; // 先标记是否有export

            // 跟前面import类似的，创建一个变量定义节点
            const variableDeclaration = t.variableDeclaration("const", [
                t.variableDeclarator(
                    t.identifier("__WEBPACK_DEFAULT_EXPORT__"),
                    t.identifier(p.node.declaration.name)
                ),
            ]);

            // 将当前节点替换为变量定义节点
            p.replaceWith(variableDeclaration);
        }
    })

    let newCode = generate(ast).code;

    if (hasExport) {
        newCode = `${EXPORT_DEFAULT_FUN} ${newCode}`;
    }

    // 下面添加模块标记代码
    newCode = `${ESMODULE_TAG_FUN} ${newCode}`;

    // 返回一个包含必要信息的新对象
    return {
        file,
        dependcies: [importFilePath],
        code: newCode,
    };
}


function parseFiles(entryFile) {
    const entryRes = parseFile(entryFile); // 解析入口文件
    const results = []; // 创建一个数组
    const dependencies = entryRes.dependcies;

    // 循环结果数组，将它的依赖全部拿出来解析
    function loop(dependencies) {
        dependencies.map(dependency => {
            if (dependency) {
                const ast = parseFile(dependency);
                results.push(ast);
                loop(ast.dependcies)
            }
        })
    }
    loop(dependencies)

    return {
        entryRes,
        results
    };
}

const allAst = parseFiles(config.entry);

console.log(allAst)

function generateCode(allAst) {
    const temlateFile = fs.readFileSync(
        path.join(__dirname, "./template.js"),
        "utf-8"
    );

    const codes = ejs.render(temlateFile, {
        __TO_REPLACE_WEBPACK_MODULES__: allAst.results,
        __TO_REPLACE_WEBPACK_ENTRY__: allAst.entryRes,
    });

    return codes;
}

const codes = generateCode(allAst);

// console.log(codes)

fs.writeFileSync(path.join(config.output.path, config.output.filename), codes);