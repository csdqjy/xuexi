## DOM

文档对象模型（DOM，Document Object Model）是 HTML 和 XML 文档的编程接口。DOM 表示由多层节点构成的文档，通过它开发者可以添加、删除和修改页面的各个部分。脱胎于网景和微软早期的动态 HTML（DHTML，Dynamic HTML），DOM 现在是真正跨平台、语言无关的表示和操作网页的方式。

DOM Level 1 在 1998 年成为 W3C 推荐标准，提供了基本文档结构和查询的接口。本章之所以介绍 DOM，主要因为它与浏览器中的 HTML 网页相关，并且在 JavaScript 中提供了 DOM API。

### 节点层级

    任何HTML或XML文档都可以用DOM表示为一个由节点构成的层级结构。节点分很多类型，每种类型对应着文档中不同的信息和（或）标记，也都有自己不同的特性、数据和方法，而且与其他类型有某种关系。这些关系构成了层级，让标记可以表示为一个以特定节点为根的树形结构。

1.  Node 类型
    DOM Level 1 描述了名为 Node 的接口，这个接口是所有 DOM 节点类型都必须实现的。Node 接口在 JavaScript 中被实现为 Node 类型，在除 IE 之外的所有浏览器中都可以直接访问这个类型。在 JavaScript 中，所有节点类型都继承 Node 类型，因此所有类型都共享相同的基本属性和方法。

    每个节点都有 nodeType 属性，表示该节点的类型。节点类型由定义在 Node 类型上的 12 个数值常量表示：

    - Node.ELEMENT_NODE（1）
    - Node.ATTRIBUTE_NODE（2）
    - Node.TEXT_NODE（3）
    - Node.CDATA_SECTION_NODE（4）
    - Node.ENTITY_REFERENCE_NODE（5）
    - Node.ENTITY_NODE（6）
    - Node.PROCESSING_INSTRUCTION_NODE（7）
    - Node.COMMENT_NODE（8）
    - Node.DOCUMENT_NODE（9）
    - Node.DOCUMENT_TYPE_NODE（10）
    - Node.DOCUMENT_FRAGMENT_NODE（11）
    - Node.NOTATION_NODE（12）

    1. nodeName 与 nodeValue
       nodeName 与 nodeValue 保存着有关节点的信息。这两个属性的值完全取决于节点类型。在使用这两个属性前，最好先检测节点类型。

    2. 节点关系
       文档中的所有节点都与其他节点有关系。这些关系可以形容为家族关系，相当于把文档树比作家谱。在 HTML 中，< body>元素是< html>元素的子元素，而< html >元素则是< body >元素的父元素。< head >元素是< body >元素的同胞元素，因为它们有共同的父元素< html>。

       每个节点都有一个 childNodes 属性，其中包含一个 NodeList 的实例。NodeList 是一个类数组对象，用于存储可以按位置存取的有序节点。注意，NodeList 并不是 Array 的实例，但可以使用中括号访问它的值，而且它也有 length 属性。NodeList 对象独特的地方在于，它其实是一个对 DOM 结构的查询，因此 DOM 结构的变化会自动地在 NodeList 中反映出来。我们通常说 NodeList 是实时的活动对象，而不是第一次访问时所获得内容的快照。

    3. 操纵节点
       因为所有关系指针都是只读的，所以 DOM 又提供了一些操纵节点的方法。最常用的方法是 appendChild()，用于在 childNodes 列表末尾添加节点。添加新节点会更新相关的关系指针，包括父节点和之前的最后一个子节点。

       如果把文档中已经存在的节点传给 appendChild()，则这个节点会从之前的位置被转移到新位置。即使 DOM 树通过各种关系指针维系，一个节点也不会在文档中同时出现在两个或更多个地方。因此，如果调用 appendChild()传入父元素的第一个子节点，则这个节点会成为父元素的最后一个子节点。

       如果想把节点放到 childNodes 中的特定位置而不是末尾，则可以使用 insertBefore()方法。这个方法接收两个参数：要插入的节点和参照节点。调用这个方法后，要插入的节点会变成参照节点的前一个同胞节点，并被返回。如果参照节点是 null，则 insertBefore()与 appendChild()效果相同。

       appendChild()和 insertBefore()在插入节点时不会删除任何已有节点。相对地，replaceChild()方法接收两个参数：要插入的节点和要替换的节点。要替换的节点会被返回并从文档树中完全移除，要插入的节点会取而代之。
       使用 replaceChild()插入一个节点后，所有关系指针都会从被替换的节点复制过来。虽然被替换的节点从技术上说仍然被同一个文档所拥有，但文档中已经没有它的位置。

       要移除节点而不是替换节点，可以使用 removeChild()方法。这个方法接收一个参数，即要移除的节点。被移除的节点会被返回。
       与 replaceChild()方法一样，通过 removeChild()被移除的节点从技术上说仍然被同一个文档所拥有，但文档中已经没有它的位置。

    4. 其他方法
       所有节点类型还共享了两个方法。第一个是 cloneNode()，会返回与调用它的节点一模一样的节点。cloneNode()方法接收一个布尔值参数，表示是否深复制。在传入 true 参数时，会进行深复制，即复制节点及其整个子 DOM 树。如果传入 false，则只会复制调用该方法的节点。复制返回的节点属于文档所有，但尚未指定父节点，所以可称为孤儿节点（orphan）。可以通过 appendChild()、insertBefore()或 replaceChild()方法把孤儿节点添加到文档中。

       本节要介绍的最后一个方法是 normalize()。这个方法唯一的任务就是处理文档子树中的文本节点。由于解析器实现的差异或 DOM 操作等原因，可能会出现并不包含文本的文本节点，或者文本节点之间互为同胞关系。在节点上调用 normalize()方法会检测这个节点的所有后代，从中搜索上述两种情形。如果发现空文本节点，则将其删除；如果两个同胞节点是相邻的，则将其合并为一个文本节点。这个方法将在本章后面进一步讨论。

2.  Document 类型
    Document 类型是 JavaScript 中表示文档节点的类型。在浏览器中，文档对象 document 是 HTMLDocument 的实例（HTMLDocument 继承 Document），表示整个 HTML 页面。document 是 window 对象的属性，因此是一个全局对象。Document 类型的节点有以下特征：

    - nodeType 等于 9；
    - nodeName 值为"#document"；
    - nodeValue 值为 null；
    - parentNode 值为 null；
    - ownerDocument 值为 null；
    - 子节点可以是 DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction 或 Comment 类型。

    Document 类型可以表示 HTML 页面或其他 XML 文档，但最常用的还是通过 HTMLDocument 的实例取得 document 对象。document 对象可用于获取关于页面的信息以及操纵其外观和底层结构。

    1. 文档子节点
       虽然 DOM 规范规定 Document 节点的子节点可以是 DocumentType、Element、ProcessingInstruction 或 Comment，但也提供了两个访问子节点的快捷方式。第一个是 documentElement 属性，始终指向 HTML 页面中的< html>元素。虽然 document.childNodes 中始终有< html>元素，但使用 documentElement 属性可以更快更直接地访问该元素。

    2. 文档信息
       document 作为 HTMLDocument 的实例，还有一些标准 Document 对象上所没有的属性。这些属性提供浏览器所加载网页的信息。其中第一个属性是 title，包含< title>元素中的文本，通常显示在浏览器窗口或标签页的标题栏。通过这个属性可以读写页面的标题，修改后的标题也会反映在浏览器标题栏上。不过，修改 title 属性并不会改变< title>元素。

       接下来要介绍的 3 个属性是 URL、domain 和 referrer。其中，URL 包含当前页面的完整 URL（地址栏中的 URL），domain 包含页面的域名，而 referrer 包含链接到当前页面的那个页面的 URL。如果当前页面没有来源，则 referrer 属性包含空字符串。

    3. 定位元素
       使用 DOM 最常见的情形可能就是获取某个或某组元素的引用，然后对它们执行某些操作。document 对象上暴露了一些方法，可以实现这些操作。getElementById()和 getElementsByTagName()就是 Document 类型提供的两个方法。

       getElementById()方法接收一个参数，即要获取元素的 ID，如果找到了则返回这个元素，如果没找到则返回 null。参数 ID 必须跟元素在页面中的 id 属性值完全匹配，包括大小写。

    4. 特殊集合
       document 对象上还暴露了几个特殊集合，这些集合也都是 HTMLCollection 的实例。这些集合是访问文档中公共部分的快捷方式，列举如下。

       - document.anchors 包含文档中所有带 name 属性的< a>元素。
       - document.applets 包含文档中所有< applet>元素（因为< applet>元素已经不建议使用，所以这个集合已经废弃）。
       - document.forms 包含文档中所有< form>元素（与 document.getElementsByTagName ("form")返回的结果相同）。
       - document.images 包含文档中所有< img>元素（与 document.getElementsByTagName ("img")返回的结果相同）。
       - document.links 包含文档中所有带 href 属性的< a>元素。

       这些特殊集合始终存在于 HTMLDocument 对象上，而且与所有 HTMLCollection 对象一样，其内容也会实时更新以符合当前文档的内容。

    5. DOM 兼容性检测
       由于 DOM 有多个 Level 和多个部分，因此确定浏览器实现了 DOM 的哪些部分是很必要的。document.implementation 属性是一个对象，其中提供了与浏览器 DOM 实现相关的信息和能力。DOM Level 1 在 document.implementation 上只定义了一个方法，即 hasFeature()。这个方法接收两个参数：特性名称和 DOM 版本。如果浏览器支持指定的特性和版本，则 hasFeature()方法返回 true。
       由于实现不一致，因此 hasFeature()的返回值并不可靠。目前这个方法已经被废弃，不再建议使用。为了向后兼容，目前主流浏览器仍然支持这个方法，但无论检测什么都一律返回 true。
    6. 文档写入
       document 对象有一个古老的能力，即向网页输出流中写入内容。这个能力对应 4 个方法：write()、writeln()、open()和 close()。其中，write()和 writeln()方法都接收一个字符串参数，可以将这个字符串写入网页中。write()简单地写入文本，而 writeln()还会在字符串末尾追加一个换行符（\n）。这两个方法可以用来在页面加载期间向页面中动态添加内容。

3.  Element 类型
    除了 Document 类型，Element 类型就是 Web 开发中最常用的类型了。Element 表示 XML 或 HTML 元素，对外暴露出访问元素标签名、子节点和属性的能力。Element 类型的节点具有以下特征：

    - nodeType 等于 1；
    - nodeName 值为元素的标签名；
    - nodeValue 值为 null；
    - parentNode 值为 Document 或 Element 对象；
    - 子节点可以是 Element、Text、Comment、ProcessingInstruction、CDATASection、EntityReference 类型。

    1. HTML 元素
       所有 HTML 元素都通过 HTMLElement 类型表示，包括其直接实例和间接实例。另外，HTMLElement 直接继承 Element 并增加了一些属性。每个属性都对应下列属性之一，它们是所有 HTML 元素上都有的标准属性：

       - id，元素在文档中的唯一标识符；
       - title，包含元素的额外信息，通常以提示条形式展示；
       - lang，元素内容的语言代码（很少用）；
       - dir，语言的书写方向（"ltr"表示从左到右，"rtl"表示从右到左，同样很少用）；
       - className，相当于 class 属性，用于指定元素的 CSS 类（因为 class 是 ECMAScript 关键字，所以不能直接用这个名字）。

    2. 取得属性
       每个元素都有零个或多个属性，通常用于为元素或其内容附加更多信息。与属性相关的 DOM 方法主要有 3 个：getAttribute()、setAttribute()和 removeAttribute()。这些方法主要用于操纵属性，包括在 HTMLElement 类型上定义的属性。

    3. 设置属性
       与 getAttribute()配套的方法是 setAttribute()，这个方法接收两个参数：要设置的属性名和属性的值。如果属性已经存在，则 setAttribute()会以指定的值替换原来的值；如果属性不存在，则 setAttribute()会以指定的值创建该属性。

    4. attributes 属性
       Element 类型是唯一使用 attributes 属性的 DOM 节点类型。attributes 属性包含一个 NamedNodeMap 实例，是一个类似 NodeList 的“实时”集合。元素的每个属性都表示为一个 Attr 节点，并保存在这个 NamedNodeMap 对象中。NamedNodeMap 对象包含下列方法：

       - getNamedItem(name)，返回 nodeName 属性等于 name 的节点；
       - removeNamedItem(name)，删除 nodeName 属性等于 name 的节点；
       - setNamedItem(node)，向列表中添加 node 节点，以其 nodeName 为索引；
       - item(pos)，返回索引位置 pos 处的节点。

    5. 创建元素
       可以使用 document.createElement()方法创建新元素。这个方法接收一个参数，即要创建元素的标签名。在 HTML 文档中，标签名是不区分大小写的，而 XML 文档（包括 XHTML）是区分大小写的。

    6. 元素后代
       元素可以拥有任意多个子元素和后代元素，因为元素本身也可以是其他元素的子元素。childNodes 属性包含元素所有的子节点，这些子节点可能是其他元素、文本节点、注释或处理指令。不同浏览器在识别这些节点时的表现有明显不同。F

4.  Text 类型
    Text 节点由 Text 类型表示，包含按字面解释的纯文本，也可能包含转义后的 HTML 字符，但不含 HTML 代码。Text 类型的节点具有以下特征：

    - nodeType 等于 3；
    - nodeName 值为"#text"；
    - nodeValue 值为节点中包含的文本；
    - parentNode 值为 Element 对象；
    - 不支持子节点。

    Text 节点中包含的文本可以通过 nodeValue 属性访问，也可以通过 data 属性访问，这两个属性包含相同的值。修改 nodeValue 或 data 的值，也会在另一个属性反映出来。文本节点暴露了以下操作文本的方法：

    - appendData(text)，向节点末尾添加文本 text；
    - deleteData(offset, count)，从位置 offset 开始删除 count 个字符；
    - insertData(offset, text)，在位置 offset 插入 text；
    - replaceData(offset, count, text)，用 text 替换从位置 offset 到 offset + count 的文本；
    - splitText(offset)，在位置 offset 将当前文本节点拆分为两个文本节点；
    - substringData(offset, count)，提取从位置 offset 到 offset + count 的文本。

    除了这些方法，还可以通过 length 属性获取文本节点中包含的字符数量。这个值等于 nodeValue.length 和 data.length。

    1. 创建文本节点
       document.createTextNode()可以用来创建新文本节点，它接收一个参数，即要插入节点的文本。跟设置已有文本节点的值一样，这些要插入的文本也会应用 HTML 或 XML 编码。

    2. 规范化文本节点
       DOM 文档中的同胞文本节点可能导致困惑，因为一个文本节点足以表示一个文本字符串。同样，DOM 文档中也经常会出现两个相邻文本节点。为此，有一个方法可以合并相邻的文本节点。这个方法叫 normalize()，是在 Node 类型中定义的（因此所有类型的节点上都有这个方法）。在包含两个或多个相邻文本节点的父节点上调用 normalize()时，所有同胞文本节点会被合并为一个文本节点，这个文本节点的 nodeValue 就等于之前所有同胞节点 nodeValue 拼接在一起得到的字符串。

    3. 拆分文本节点
       Text 类型定义了一个与 normalize()相反的方法——splitText()。这个方法可以在指定的偏移位置拆分 nodeValue，将一个文本节点拆分成两个文本节点。拆分之后，原来的文本节点包含开头到偏移位置前的文本，新文本节点包含剩下的文本。这个方法返回新的文本节点，具有与原来的文本节点相同的 parentNode。

5.  Comment 类型
    DOM 中的注释通过 Comment 类型表示。Comment 类型的节点具有以下特征：

    - nodeType 等于 8；
    - nodeName 值为"#comment"；
    - nodeValue 值为注释的内容；
    - parentNode 值为 Document 或 Element 对象；
    - 不支持子节点。

    Comment 类型与 Text 类型继承同一个基类（CharacterData），因此拥有除 splitText()之外 Text 节点所有的字符串操作方法。与 Text 类型相似，注释的实际内容可以通过 nodeValue 或 data 属性获得。

6.  CDATASection 类型
    CDATASection 类型表示 XML 中特有的 CDATA 区块。CDATASection 类型继承 Text 类型，因此拥有包括 splitText()在内的所有字符串操作方法。CDATASection 类型的节点具有以下特征：

    - nodeType 等于 4；
    - nodeName 值为"#cdata-section"；
    - nodeValue 值为 CDATA 区块的内容；
    - parentNode 值为 Document 或 Element 对象；
    - 不支持子节点。

    CDATA 区块只在 XML 文档中有效，因此某些浏览器比较陈旧的版本会错误地将 CDATA 区块解析为 Comment 或 Element。

7.  DocumentType 类型
    DocumentType 类型的节点包含文档的文档类型（doctype）信息，具有以下特征：

    - nodeType 等于 10；
    - nodeName 值为文档类型的名称；
    - nodeValue 值为 null；
    - parentNode 值为 Document 对象；
    - 不支持子节点。

    DocumentType 对象在 DOM Level 1 中不支持动态创建，只能在解析文档代码时创建。对于支持这个类型的浏览器，DocumentType 对象保存在 document.doctype 属性中。DOM Level 1 规定了 DocumentType 对象的 3 个属性：name、entities 和 notations。其中，name 是文档类型的名称，entities 是这个文档类型描述的实体的 NamedNodeMap，而 notations 是这个文档类型描述的表示法的 NamedNodeMap。因为浏览器中的文档通常是 HTML 或 XHTML 文档类型，所以 entities 和 notations 列表为空。（这个对象只包含行内声明的文档类型。）无论如何，只有 name 属性是有用的。这个属性包含文档类型的名称，即紧跟在< !DOCTYPE 后面的那串文本。

8.  DocumentFragment 类型
    在所有节点类型中，DocumentFragment 类型是唯一一个在标记中没有对应表示的类型。DOM 将文档片段定义为“轻量级”文档，能够包含和操作节点，却没有完整文档那样额外的消耗。DocumentFragment 节点具有以下特征：

    - nodeType 等于 11；
    - nodeName 值为"#document-fragment"；
    - nodeValue 值为 null；
    - parentNode 值为 null；
    - 子节点可以是 Element、ProcessingInstruction、Comment、Text、CDATASection 或 EntityReference。

    不能直接把文档片段添加到文档。相反，文档片段的作用是充当其他要被添加到文档的节点的仓库。可以使用 document.createDocumentFragment()方法像创建文档片段。
    文档片段从 Node 类型继承了所有文档类型具备的可以执行 DOM 操作的方法。如果文档中的一个节点被添加到一个文档片段，则该节点会从文档树中移除，不会再被浏览器渲染。添加到文档片段的新节点同样不属于文档树，不会被浏览器渲染。可以通过 appendChild()或 insertBefore()方法将文档片段的内容添加到文档。在把文档片段作为参数传给这些方法时，这个文档片段的所有子节点会被添加到文档中相应的位置。文档片段本身永远不会被添加到文档树。

9.  Attr 类型
    元素数据在 DOM 中通过 Attr 类型表示。Attr 类型构造函数和原型在所有浏览器中都可以直接访问。技术上讲，属性是存在于元素 attributes 属性中的节点。Attr 节点具有以下特征：

    - nodeType 等于 2；
    - nodeName 值为属性名；
    - nodeValue 值为属性值；
    - parentNode 值为 null；
    - 在 HTML 中不支持子节点；
    - 在 XML 中子节点可以是 Text 或 EntityReference。

    属性节点尽管是节点，却不被认为是 DOM 文档树的一部分。Attr 节点很少直接被引用，通常开发者更喜欢使用 getAttribute()、removeAttribute()和 setAttribute()方法操作属性。

    Attr 对象上有 3 个属性：name、value 和 specified。其中，name 包含属性名（与 nodeName 一样），value 包含属性值（与 nodeValue 一样），而 specified 是一个布尔值，表示属性使用的是默认值还是被指定的值。

    可以使用 document.createAttribute()方法创建新的 Attr 节点，参数为属性名。

### DOM 编程

很多时候，操作 DOM 是很直观的。通过 HTML 代码能实现的，也一样能通过 JavaScript 实现。但有时候，DOM 也没有看起来那么简单。浏览器能力的参差不齐和各种问题，也会导致 DOM 的某些方面会复杂一些。

1. 动态脚本
   < script>元素用于向网页中插入 JavaScript 代码，可以是 src 属性包含的外部文件，也可以是作为该元素内容的源代码。动态脚本就是在页面初始加载时不存在，之后又通过 DOM 包含的脚本。与对应的 HTML 元素一样，有两种方式通过< script>动态为网页添加脚本：引入外部文件和直接插入源代码。

2. 动态样式
   CSS 样式在 HTML 页面中可以通过两个元素加载。< link>元素用于包含 CSS 外部文件，而< style>元素用于添加嵌入样式。与动态脚本类似，动态样式也是页面初始加载时并不存在，而是在之后才添加到页面中的。

3. 操作表格
   表格是 HTML 中最复杂的结构之一。通过 DOM 编程创建< table>元素，通常要涉及大量标签，包括表行、表元、表题，等等。因此，通过 DOM 编程创建和修改表格时可能要写很多代码。
   为了方便创建表格，HTML DOM 给< table>、< tbody>和< tr>元素添加了一些属性和方法。
   < table>元素添加了以下属性和方法：

   - caption，指向< caption>元素的指针（如果存在）；
   - tBodies，包含< tbody>元素的 HTMLCollection；
   - tFoot，指向< tfoot>元素（如果存在）；
   - tHead，指向< thead>元素（如果存在）；
   - rows，包含表示所有行的 HTMLCollection；
   - createTHead()，创建< thead>元素，放到表格中，返回引用；
   - createTFoot()，创建< tfoot>元素，放到表格中，返回引用；
   - createCaption()，创建< caption>元素，放到表格中，返回引用；
   - deleteTHead()，删除< thead>元素；
   - deleteTFoot()，删除< tfoot>元素；
   - deleteCaption()，删除< caption>元素；
   - deleteRow(pos)，删除给定位置的行；
   - insertRow(pos)，在行集合中给定位置插入一行。

   < tbody>元素添加了以下属性和方法：

   - rows，包含< tbody>元素中所有行的 HTMLCollection；
   - deleteRow(pos)，删除给定位置的行；
   - insertRow(pos)，在行集合中给定位置插入一行，返回该行的引用。

   < tr>元素添加了以下属性和方法：

   - cells，包含< tr>元素所有表元的 HTMLCollection；
   - deleteCell(pos)，删除给定位置的表元；
   - insertCell(pos)，在表元集合给定位置插入一个表元，返回该表元的引用。

4. 使用 NodeList
   理解 NodeList 对象和相关的 NamedNodeMap、HTMLCollection，是理解 DOM 编程的关键。这 3 个集合类型都是“实时的”，意味着文档结构的变化会实时地在它们身上反映出来，因此它们的值始终代表最新的状态。实际上，NodeList 就是基于 DOM 文档的实时查询。

### MutationObserver 接口

不久前添加到 DOM 规范中的 MutationObserver 接口，可以在 DOM 被修改时异步执行回调。使用 MutationObserver 可以观察整个文档、DOM 树的一部分，或某个元素。此外还可以观察元素属性、子节点、文本，或者前三者任意组合的变化。

1. 基本用法
   MutationObserver 的实例要通过调用 MutationObserver 构造函数并传入一个回调函数来创建：

   ```javascript
   let observer = new MutationObserver(() => console.log("DOM was mutated!"));
   ```

   1. observe()方法
      新创建的 MutationObserver 实例不会关联 DOM 的任何部分。要把这个 observer 与 DOM 关联起来，需要使用 observe()方法。这个方法接收两个必需的参数：要观察其变化的 DOM 节点，以及一个 MutationObserverInit 对象。

   2. 回调与 MutationRecord
      每个回调都会收到一个 MutationRecord 实例的数组。MutationRecord 实例包含的信息包括发生了什么变化，以及 DOM 的哪一部分受到了影响。因为回调执行之前可能同时发生多个满足观察条件的事件，所以每次执行回调都会传入一个包含按顺序入队的 MutationRecord 实例的数组。

   3. disconnect()方法
      默认情况下，只要被观察的元素不被垃圾回收，MutationObserver 的回调就会响应 DOM 变化事件，从而被执行。要提前终止执行回调，可以调用 disconnect()方法。

   4. 复用 MutationObserver
      多次调用 observe()方法，可以复用一个 MutationObserver 对象观察多个不同的目标节点。此时，MutationRecord 的 target 属性可以标识发生变化事件的目标节点。

   5. 重用 MutationObserver
      调用 disconnect()并不会结束 MutationObserver 的生命。还可以重新使用这个观察者，再将它关联到新的目标节点。

2. MutationObserverInit 与观察范围
   MutationObserverInit 对象用于控制对目标节点的观察范围。粗略地讲，观察者可以观察的事件包括属性变化、文本变化和子节点变化。

   1. 观察属性
      MutationObserver 可以观察节点属性的添加、移除和修改。要为属性变化注册回调，需要在 MutationObserverInit 对象中将 attributes 属性设置为 true。

   2. 观察字符数据
      MutationObserver 可以观察文本节点（如 Text、Comment 或 ProcessingInstruction 节点）中字符的添加、删除和修改。要为字符数据注册回调，需要在 MutationObserverInit 对象中将 characterData 属性设置为 true。

   3. 观察子节点
      MutationObserver 可以观察目标节点子节点的添加和移除。要观察子节点，需要在 MutationObserverInit 对象中将 childList 属性设置为 true。

   4. 观察子树
      默认情况下，MutationObserver 将观察的范围限定为一个元素及其子节点的变化。可以把观察的范围扩展到这个元素的子树（所有后代节点），这需要在 MutationObserverInit 对象中将 subtree 属性设置为 true。

3. 异步回调与记录队列
   MutationObserver 接口是出于性能考虑而设计的，其核心是异步回调与记录队列模型。为了在大量变化事件发生时不影响性能，每次变化的信息（由观察者实例决定）会保存在 MutationRecord 实例中，然后添加到记录队列。这个队列对每个 MutationObserver 实例都是唯一的，是所有 DOM 变化事件的有序列表。

   1. 记录队列
      每次 MutationRecord 被添加到 MutationObserver 的记录队列时，仅当之前没有已排期的微任务回调时（队列中微任务长度为 0），才会将观察者注册的回调（在初始化 MutationObserver 时传入）作为微任务调度到任务队列上。这样可以保证记录队列的内容不会被回调处理两次。

      不过在回调的微任务异步执行期间，有可能又会发生更多变化事件。因此被调用的回调会接收到一个 MutationRecord 实例的数组，顺序为它们进入记录队列的顺序。回调要负责处理这个数组的每一个实例，因为函数退出之后这些实现就不存在了。回调执行后，这些 MutationRecord 就用不着了，因此记录队列会被清空，其内容会被丢弃。

   2. takeRecords()方法
      调用 MutationObserver 实例的 takeRecords()方法可以清空记录队列，取出并返回其中的所有 MutationRecord 实例。

4. 性能、内存与垃圾回收
   DOM Level 2 规范中描述的 MutationEvent 定义了一组会在各种 DOM 变化时触发的事件。由于浏览器事件的实现机制，这个接口出现了严重的性能问题。因此，DOM Level 3 规定废弃了这些事件。MutationObserver 接口就是为替代这些事件而设计的更实用、性能更好的方案。

   将变化回调委托给微任务来执行可以保证事件同步触发，同时避免随之而来的混乱。为 MutationObserver 而实现的记录队列，可以保证即使变化事件被爆发式地触发，也不会显著地拖慢浏览器。

   无论如何，使用 MutationObservder 仍然不是没有代价的。因此理解什么时候避免出现这种情况就很重要了。

   1. MutationObserver 的引用
      MutationObserver 实例与目标节点之间的引用关系是非对称的。MutationObserver 拥有对要观察的目标节点的弱引用。因为是弱引用，所以不会妨碍垃圾回收程序回收目标节点。

      然而，目标节点却拥有对 MutationObserver 的强引用。如果目标节点从 DOM 中被移除，随后被垃圾回收，则关联的 MutationObserver 也会被垃圾回收。

   2. MutationRecord 的引用

      记录队列中的每个 MutationRecord 实例至少包含对已有 DOM 节点的一个引用。如果变化是 childList 类型，则会包含多个节点的引用。记录队列和回调处理的默认行为是耗尽这个队列，处理每个 MutationRecord，然后让它们超出作用域并被垃圾回收。

      有时候可能需要保存某个观察者的完整变化记录。保存这些 MutationRecord 实例，也就会保存它们引用的节点，因而会妨碍这些节点被回收。如果需要尽快地释放内存，建议从每个 MutationRecord 中抽取出最有用的信息，然后保存到一个新对象中，最后抛弃 MutationRecord。
