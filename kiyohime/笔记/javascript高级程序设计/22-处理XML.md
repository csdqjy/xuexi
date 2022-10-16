## 处理 XML

XML 曾一度是在互联网上存储和传输结构化数据的标准。XML 的发展反映了 Web 的发展，因为 DOM 标准不仅是为了在浏览器中使用，而且还为了在桌面和服务器应用程序中处理 XML 数据结构。在没有 DOM 标准的时候，很多开发者使用 JavaScript 编写自己的 XML 解析器。自从有了 DOM 标准，所有浏览器都开始原生支持 XML、XML DOM 及很多其他相关技术。

1. 浏览器对 XML DOM 的支持
   因为很多浏览器在正式标准问世之前就开始实现 XML 解析方案，所以不同浏览器对标准的支持不仅有级别上的差异，也有实现上的差异。DOM Level 3 增加了解析和序列化能力。不过，在 DOM Level 3 制定完成时，大多数浏览器也已实现了自己的解析方案。

   1. DOM Level 2 Core
      正如第 12 章所述，DOM Level 2 增加了 document.implementation 的 createDocument()方法。有读者可能还记得，可以像下面这样创建空 XML 文档：

      ```javascript
      let xmldom = document.implementation.createDocument(
        namespaceUri,
        root,
        doctype
      );
      ```

      在 JavaScript 中处理 XML 时，root 参数通常只会使用一次，因为这个参数定义的是 XML DOM 中 document 元素的标签名。namespaceUri 参数用得很少，因为在 JavaScript 中很难管理命名空间。doctype 参数则更是少用。

      要创建一个 document 对象标签名为< root>的新 XML 文档，可以使用以下代码：

      ```javascript
      let xmldom = document.implementation.createDocument("", "root", null);

      console.log(xmldom.documentElement.tagName); // "root"

      let child = xmldom.createElement("child");
      xmldom.documentElement.appendChild(child);
      ```

      这个例子创建了一个 XML DOM 文档，该文档没有默认的命名空间和文档类型。注意，即使不指定命名空间和文档类型，参数还是要传的。命名空间传入空字符串表示不应用命名空间，文档类型传入 null 表示没有文档类型。xmldom 变量包含 DOM Level 2 Document 类型的实例，包括第 12 章介绍的所有 DOM 方法和属性。在这个例子中，我们打印了 document 元素的标签名，然后又为它创建并添加了一个新的子元素。

      要检查浏览器是否支持 DOM Level 2 XML，可以使用如下代码：

      ```javascript
      let hasXmlDom = document.implementation.hasFeature("XML", "2.0");
      ```

      实践中，很少需要凭空创建 XML 文档，然后使用 DOM 方法来系统创建 XML 数据结构。更多是把 XML 文档解析为 DOM 结构，或者相反。因为 DOM Level 2 并未提供这种功能，所以出现了一些事实标准。

   2. DOMParser 类型
      Firefox 专门为把 XML 解析为 DOM 文档新增了 DOMParser 类型，后来所有其他浏览器也实现了该类型。要使用 DOMParser，需要先创建它的一个实例，然后再调用 parseFromString()方法。这个方法接收两个参数：要解析的 XML 字符串和内容类型（始终应该是"text/html"）。返回值是 Document 的实例。来看下面的例子：

      ```javascript
      let parser = new DOMParser();
      let xmldom = parser.parseFromString("<root><child/></root>", "text/xml");

      console.log(xmldom.documentElement.tagName); // "root"
      console.log(xmldom.documentElement.firstChild.tagName); // "child"

      let anotherChild = xmldom.createElement("child");
      xmldom.documentElement.appendChild(anotherChild);

      let children = xmldom.getElementsByTagName("child");
      console.log(children.length); // 2
      ```

      这个例子把简单的 XML 字符串解析为 DOM 文档。得到的 DOM 结构中<root>是 document 元素，它有个子元素<child>。然后就可以使用 DOM 方法与返回的文档进行交互。

      DOMParser 只能解析格式良好的 XML，因此不能把 HTML 解析为 HTML 文档。在发生解析错误时，不同浏览器的行为也不一样。Firefox、Opera、Safari 和 Chrome 在发生解析错误时，parseFromString()方法仍会返回一个 Document 对象，只不过其 document 元素是< parsererror>，该元素的内容为解析错误的描述。

   3. XMLSerializer 类型
      与 DOMParser 相对，Firefox 也增加了 XMLSerializer 类型用于提供相反的功能：把 DOM 文档序列化为 XML 字符串。此后，XMLSerializer 也得到了所有主流浏览器的支持。

      要序列化 DOM 文档，必须创建 XMLSerializer 的新实例，然后把文档传给 serializeToString()方法，如下所示：

      ```javascript
      let serializer = new XMLSerializer();
      let xml = serializer.serializeToString(xmldom);
      console.log(xml);
      ```

      serializeToString()方法返回的值是打印效果不好的字符串，因此肉眼看起来有点困难。

      XMLSerializer 能够序列化任何有效的 DOM 对象，包括个别节点和 HTML 文档。在把 HTML 文档传给 serializeToString()时，这个文档会被当成 XML 文档，因此得到的结果是格式良好的。

2. 浏览器对 XPath 的支持
   XPath 是为了在 DOM 文档中定位特定节点而创建的，因此它对 XML 处理很重要。在 DOM Level 3 之前，XPath 相关的 API 没有被标准化。DOM Level 3 开始着手标准化 XPath。很多浏览器实现了 DOM Level 3 XPath 标准，但 IE 决定按照自己的方式实现。

   1. DOM Level 3 XPath
      DOM Level 3 XPath 规范定义了接口，用于在 DOM 中求值 XPath 表达式。要确定浏览器是否支持 DOM Level 3 XPath，可以使用以下代码：

      ```javascript
      let supportsXPath = document.implementation.hasFeature("XPath", "3.0");
      ```

      虽然这个规范定义了不少类型，但其中最重要的两个是 XPathEvaluator 和 XPathResult。XPathEvaluator 用于在特定上下文中求值 XPath 表达式，包含三个方法。

      - createExpression(expression, nsresolver)，用于根据 XPath 表达式及相应的命名空间计算得到一个 XPathExpression，XPathExpression 是查询的编译版本。这适合于同样的查询要运行多次的情况。
      - createNSResolver(node)，基于 node 的命名空间创建新的 XPathNSResolver 对象。当对使用名称空间的 XML 文档求值时，需要 XPathNSResolver 对象。
      - evaluate(expression, context, nsresolver, type, result)，根据给定的上下文和命名空间对 XPath 进行求值。其他参数表示如何返回结果。

      Document 类型通常是通过 XPathEvaluator 接口实现的，因此可以创建 XPathEvaluator 的实例，或使用 Document 实例上的方法（包括 XML 和 HTML 文档）。

      在上述三个方法中，使用最频繁的是 evaluate()。这个方法接收五个参数：XPath 表达式、上下文节点、命名空间解析器、返回的结果类型和 XPathResult 对象（用于填充结果，通常是 null，因为结果也可能是函数值）。第三个参数，命名空间解析器，只在 XML 代码使用 XML 命名空间的情况下有必要。如果没有使用命名空间，这个参数也应该是 null。第四个参数要返回值的类型是如下 10 个常量值之一。

      - XPathResult.ANY_TYPE：返回适合 XPath 表达式的数据类型。
      - XPathResult.NUMBER_TYPE：返回数值。
      - XPathResult.STRING_TYPE：返回字符串值。
      - XPathResult.BOOLEAN_TYPE：返回布尔值。
      - XPathResult.UNORDERED_NODE_ITERATOR_TYPE：返回匹配节点的集合，但集合中节点的顺序可能与它们在文档中的顺序不一致。
      - XPathResult.ORDERED_NODE_ITERATOR_TYPE：返回匹配节点的集合，集合中节点的顺序与它们在文档中的顺序一致。这是非常常用的结果类型。
      - XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE：返回节点集合的快照，在文档外部捕获节点，因此对文档的进一步修改不会影响该节点集合。集合中节点的顺序可能与它们在文档中的顺序不一致。
      - XPathResult.ORDERED_NODE_SNAPSHOT_TYPE：返回节点集合的快照，在文档外部捕获节点，因此对文档的进一步修改不会影响这个节点集合。集合中节点的顺序与它们在文档中的顺序一致。
      - XPathResult.ANY_UNORDERED_NODE_TYPE：返回匹配节点的集合，但集合中节点的顺序可能与它们在文档中的顺序不一致。
      - XPathResult.FIRST_ORDERED_NODE_TYPE：返回只有一个节点的节点集合，包含文档中第一个匹配的节点。

      指定的结果类型决定了如何获取结果的值。下面是一个典型的示例：

      ```javascript
      let result = xmldom.evaluate(
        "employee/name",
        xmldom.documentElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
      );

      if (result !== null) {
        let element = result.iterateNext();
        while (element) {
          console.log(element.tagName);
          node = result.iterateNext();
        }
      }
      ```

      这个例子使用了 XPathResult.ORDERED_NODE_ITERATOR_TYPE 结果类型，也是最常用的类型。如果没有节点匹配 XPath 表达式，evaluate()方法返回 null；否则，返回 XPathResult 对象。返回的 XPathResult 对象上有相应的属性和方法用于获取特定类型的结果。如果结果是节点迭代器，无论有序还是无序，都必须使用 iterateNext()方法获取结果中每个匹配的节点。在没有更多匹配节点时，iterateNext()返回 null。

      如果指定了快照结果类型（无论有序还是无序），都必须使用 snapshotItem()方法和 snapshotLength 属性获取结果，如以下代码所示：

      ```javascript
      let result = xmldom.evaluate(
        "employee/name",
        xmldom.documentElement,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      if (result !== null) {
        for (let i = 0, len = result.snapshotLength; i < len; i++) {
          console.log(result.snapshotItem(i).tagName);
        }
      }
      ```

      这个例子中，snapshotLength 返回快照中节点的数量，而 snapshotItem()返回快照中给定位置的节点（类似于 NodeList 中的 length 和 item()）。

   2. 单个节点结果
      XPathResult.FIRST_ORDERED_NODE_TYPE 结果类型返回匹配的第一个节点，可以通过结果的 singleNodeValue 属性获取。比如：

      ```javascript
      let result = xmldom.evaluate(
        "employee/name",
        xmldom.documentElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );

      if (result !== null) {
        console.log(result.singleNodeValue.tagName);
      }
      ```
    