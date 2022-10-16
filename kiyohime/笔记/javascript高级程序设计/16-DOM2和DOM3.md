## DOM2 和 DOM3

DOM1（DOM Level 1）主要定义了 HTML 和 XML 文档的底层结构。DOM2（DOM Level 2）和 DOM3（DOM Level 3）在这些结构之上加入更多交互能力，提供了更高级的 XML 特性。实际上，DOM2 和 DOM3 是按照模块化的思路来制定标准的，每个模块之间有一定关联，但分别针对某个 DOM 子集。这些模式如下所示。

- DOM Core：在 DOM1 核心部分的基础上，为节点增加方法和属性。
- DOM Views：定义基于样式信息的不同视图。
- DOM Events：定义通过事件实现 DOM 文档交互。
- DOM Style：定义以编程方式访问和修改 CSS 样式的接口。
- DOM Traversal and Range：新增遍历 DOM 文档及选择文档内容的接口。
- DOM HTML：在 DOM1 HTML 部分的基础上，增加属性、方法和新接口。
- DOM Mutation Observers：定义基于 DOM 变化触发回调的接口。这个模块是 DOM4 级模块，用于取代 Mutation Events。

本章介绍除 DOM Events 和 DOM Mutation Observers 之外的其他所有模块，第 17 章会专门介绍事件，而 DOM Mutation Observers 第 14 章已经介绍过了。DOM3 还有 XPath 模块和 Load and Save 模块，将在第 22 章介绍。

1. DOM 的演进

   DOM2 和 DOM3 Core 模块的目标是扩展 DOM API，满足 XML 的所有需求并提供更好的错误处理和特性检测。很大程度上，这意味着支持 XML 命名空间的概念。DOM2 Core 没有新增任何类型，仅仅在 DOM1 Core 基础上增加了一些方法和属性。DOM3 Core 则除了增强原有类型，也新增了一些新类型。

   类似地，DOM View 和 HTML 模块也丰富了 DOM 接口，定义了新的属性和方法。这两个模块很小，因此本章将在讨论 JavaScript 对象的基本变化时将它们与 Core 模块放在一起讨论。

   1. XML 命名空间
      XML 命名空间可以实现在一个格式规范的文档中混用不同的 XML 语言，而不必担心元素命名冲突。严格来讲，XML 命名空间在 XHTML 中才支持，HTML 并不支持。因此，本节的示例使用 XHTML。

      1. Node 的变化

      2. Document 的变化

      3. Element 的变化

      4. NamedNodeMap 的变化

   2. 其他变化
      除命名空间相关的变化，DOM2 Core 还对 DOM 的其他部分做了一些更新。这些变化与 XML 命名空间无关，主要关注 DOM API 的完整性与可靠性。

      1. DocumentType 的变化
         DocumentType 新增了 3 个属性：publicId、systemId 和 internalSubset。publicId、systemId 属性表示文档类型声明中有效但无法使用 DOM1 API 访问的数据。

      2. Document 的变化
         Document 类型的更新中唯一跟命名空间无关的方法是 importNode()。这个方法的目的是从其他文档获取一个节点并导入到新文档，以便将其插入新文档。每个节点都有一个 ownerDocument 属性，表示所属文档。如果调用 appendChild()方法时传入节点的 ownerDocument 不是指向当前文档，则会发生错误。而调用 importNode()导入其他文档的节点会返回一个新节点，这个新节点的 ownerDocument 属性是正确的。

         DOM2 View 给 Document 类型增加了新属性 defaultView，是一个指向拥有当前文档的窗口（或窗格< frame>）的指针。这个规范中并没有明确视图何时可用，因此这是添加的唯一一个属性。defaultView 属性得到了除 IE8 及更早版本之外所有浏览器的支持。

         DOM2 Core 还针对 document.implementation 对象增加了两个新方法：createDocumentType()和 createDocument()。前者用于创建 DocumentType 类型的新节点，接收 3 个参数：文档类型名称、publicId 和 systemId。

         已有文档的文档类型不可更改，因此 createDocumentType()只在创建新文档时才会用到，而创建新文档要使用 createDocument()方法。createDocument()接收 3 个参数：文档元素的 namespaceURI、文档元素的标签名和文档类型。

         DOM2 HTML 模块也为 document.implamentation 对象添加了 createHTMLDocument()方法。使用这个方法可以创建一个完整的 HTML 文档，包含< html>、< head>、< title>和< body>元素。这个方法只接收一个参数，即新创建文档的标题（放到< title>元素中），返回一个新的 HTML 文档。

      3. Node 的变化
         DOM3 新增了两个用于比较节点的方法：isSameNode()和 isEqualNode()。这两个方法都接收一个节点参数，如果这个节点与参考节点相同或相等，则返回 true。节点相同，意味着引用同一个对象；节点相等，意味着节点类型相同，拥有相等的属性（nodeName、nodeValue 等），而且 attributes 和 childNodes 也相等（即同样的位置包含相等的值）。

         DOM3 也增加了给 DOM 节点附加额外数据的方法。setUserData()方法接收 3 个参数：键、值、处理函数，用于给节点追加数据。

      4. 内嵌窗格的变化
         DOM2 HTML 给 HTMLIFrameElement（即< iframe>，内嵌窗格）类型新增了一个属性，叫 contentDocument。这个属性包含代表子内嵌窗格中内容的 document 对象的指针。

### 样式

HTML 中的样式有 3 种定义方式：外部样式表（通过< link>元素）、文档样式表（使用< style>元素）和元素特定样式（使用 style 属性）。DOM2 Style 为这 3 种应用样式的机制都提供了 API。

1.  存取元素样式
    任何支持 style 属性的 HTML 元素在 JavaScript 中都会有一个对应的 style 属性。这个 style 属性是 CSSStyleDeclaration 类型的实例，其中包含通过 HTML style 属性为元素设置的所有样式信息，但不包含通过层叠机制从文档样式和外部样式中继承来的样式。HTML style 属性中的 CSS 属性在 JavaScript style 对象中都有对应的属性。因为 CSS 属性名使用连字符表示法（用连字符分隔两个单词，如 background-image），所以在 JavaScript 中这些属性必须转换为驼峰大小写形式（如 backgroundImage）。

    大多数属性名会这样直接转换过来。但有一个 CSS 属性名不能直接转换，它就是 float。因为 float 是 JavaScript 的保留字，所以不能用作属性名。DOM2 Style 规定它在 style 对象中对应的属性应该是 cssFloat。

    1. DOM 样式属性和方法
       DOM2 Style 规范也在 style 对象上定义了一些属性和方法。这些属性和方法提供了元素 style 属性的信息并支持修改，列举如下。

       - cssText，包含 style 属性中的 CSS 代码。
       - length，应用给元素的 CSS 属性数量。
       - parentRule，表示 CSS 信息的 CSSRule 对象（下一节会讨论 CSSRule 类型）。
       - getPropertyCSSValue(propertyName)，返回包含 CSS 属性 propertyName 值的 CSSValue 对象（已废弃）。
       - getPropertyPriority(propertyName)，如果 CSS 属性 propertyName 使用了!important 则返回"important"，否则返回空字符串。
       - getPropertyValue(propertyName)，返回属性 propertyName 的字符串值。
       - item(index)，返回索引为 index 的 CSS 属性名。
       - removeProperty(propertyName)，从样式中删除 CSS 属性 propertyName。
       - setProperty(propertyName, value, priority)，设置 CSS 属性 propertyName 的值为 value，priority 是"important"或空字符串。

    2. 计算样式
       style 对象中包含支持 style 属性的元素为这个属性设置的样式信息，但不包含从其他样式表层叠继承的同样影响该元素的样式信息。DOM2 Style 在 document.defaultView 上增加了 getComputedStyle()方法。这个方法接收两个参数：要取得计算样式的元素和伪元素字符串（如":after"）。如果不需要查询伪元素，则第二个参数可以传 null。getComputedStyle()方法返回一个 CSSStyleDeclaration 对象（与 style 属性的类型一样），包含元素的计算样式。

2.  操作样式表
    CSSStyleSheet 类型表示 CSS 样式表，包括使用< link>元素和通过< style>元素定义的样式表。注意，这两个元素本身分别是 HTMLLinkElement 和 HTMLStyleElement。CSSStyleSheet 类型是一个通用样式表类型，可以表示以任何方式在 HTML 中定义的样式表。另外，元素特定的类型允许修改 HTML 属性，而 CSSStyleSheet 类型的实例则是一个只读对象（只有一个属性例外）。

    CSSStyleSheet 类型继承 StyleSheet，后者可用作非 CSS 样式表的基类。以下是 CSSStyleSheet 从 StyleSheet 继承的属性。

    - disabled，布尔值，表示样式表是否被禁用了（这个属性是可读写的，因此将它设置为 true 会禁用样式表）。
    - href，如果是使用< link>包含的样式表，则返回样式表的 URL，否则返回 null。
    - media，样式表支持的媒体类型集合，这个集合有一个 length 属性和一个 item()方法，跟所有 DOM 集合一样。同样跟所有 DOM 集合一样，也可以使用中括号访问集合中特定的项。如果样式表可用于所有媒体，则返回空列表。
    - ownerNode，指向拥有当前样式表的节点，在 HTML 中要么是< link>元素要么是< style>元素（在 XML 中可以是处理指令）。如果当前样式表是通过@import 被包含在另一个样式表中，则这个属性值为 null。
    - parentStyleSheet，如果当前样式表是通过@import 被包含在另一个样式表中，则这个属性指向导入它的样式表。
    - title，ownerNode 的 title 属性。
    - type，字符串，表示样式表的类型。对 CSS 样式表来说，就是"text/css"。

    上述属性里除了 disabled，其他属性都是只读的。除了上面继承的属性，CSSStyleSheet 类型还支持以下属性和方法。

    - cssRules，当前样式表包含的样式规则的集合。
    - ownerRule，如果样式表是使用@import 导入的，则指向导入规则；否则为 null。
    - deleteRule(index)，在指定位置删除 cssRules 中的规则。
    - insertRule(rule, index)，在指定位置向 cssRules 中插入规则。

    document.styleSheets 表示文档中可用的样式表集合。这个集合的 length 属性保存着文档中样式表的数量，而每个样式表都可以使用中括号或 item()方法获取。

    1. CSS 规则
       CSSRule 类型表示样式表中的一条规则。这个类型也是一个通用基类，很多类型都继承它，但其中最常用的是表示样式信息的 CSSStyleRule（其他 CSS 规则还有@import、@font-face、@page 和@charset 等，不过这些规则很少需要使用脚本来操作）。以下是 CSSStyleRule 对象上可用的属性。

       - cssText，返回整条规则的文本。这里的文本可能与样式表中实际的文本不一样，因为浏览器内部处理样式表的方式也不一样。Safari 始终会把所有字母都转换为小写。
       - parentRule，如果这条规则被其他规则（如@media）包含，则指向包含规则，否则就是 null。
       - parentStyleSheet，包含当前规则的样式表。
       - selectorText，返回规则的选择符文本。这里的文本可能与样式表中实际的文本不一样，因为浏览器内部处理样式表的方式也不一样。这个属性在 Firefox、Safari、Chrome 和 IE 中是只读的，在 Opera 中是可以修改的。
       - style，返回 CSSStyleDeclaration 对象，可以设置和获取当前规则中的样式。
       - type，数值常量，表示规则类型。对于样式规则，它始终为 1。

       在这些属性中，使用最多的是 cssText、selectorText 和 style。cssText 属性与 style.cssText 类似，不过并不完全一样。前者包含选择符文本和环绕样式声明的大括号，而后者则只包含样式声明（类似于元素上的 style.cssText）。此外，cssText 是只读的，而 style.cssText 可以被重写。

       多数情况下，使用 style 属性就可以实现操作样式规则的任务了。这个对象可以像每个元素上的 style 对象一样，用来读取或修改规则的样式。

    2. 创建规则
       DOM 规定，可以使用 insertRule()方法向样式表中添加新规则。这个方法接收两个参数：规则的文本和表示插入位置的索引值。

    3. 删除规则
       支持从样式表中删除规则的 DOM 方法是 deleteRule()，它接收一个参数：要删除规则的索引。

3.  元素尺寸
    本节介绍的属性和方法并不是 DOM2 Style 规范中定义的，但与 HTML 元素的样式有关。DOM 一直缺乏页面中元素实际尺寸的规定。IE 率先增加了一些属性，向开发者暴露元素的尺寸信息。这些属性现在已经得到所有主流浏览器支持。

    1. 偏移尺寸
       第一组属性涉及偏移尺寸（offset dimensions），包含元素在屏幕上占用的所有视觉空间。元素在页面上的视觉空间由其高度和宽度决定，包括所有内边距、滚动条和边框（但不包含外边距）。以下 4 个属性用于取得元素的偏移尺寸。

       - offsetHeight，元素在垂直方向上占用的像素尺寸，包括它的高度、水平滚动条高度（如果可见）和上、下边框的高度。
       - offsetLeft，元素左边框外侧距离包含元素左边框内侧的像素数。
       - offsetTop，元素上边框外侧距离包含元素上边框内侧的像素数。
       - offsetWidth，元素在水平方向上占用的像素尺寸，包括它的宽度、垂直滚动条宽度（如果可见）和左、右边框的宽度。

       其中，offsetLeft 和 offsetTop 是相对于包含元素的，包含元素保存在 offsetParent 属性中。offsetParent 不一定是 parentNode。比如，< td>元素的 offsetParent 是作为其祖先的< table>元素，因为< table>是节点层级中第一个提供尺寸的元素。

       要确定一个元素在页面中的偏移量，可以把它的 offsetLeft 和 offsetTop 属性分别与 offsetParent 的相同属性相加，一直加到根元素。

    2. 客户端尺寸
       元素的客户端尺寸（client dimensions）包含元素内容及其内边距所占用的空间。客户端尺寸只有两个相关属性：clientWidth 和 clientHeight。其中，clientWidth 是内容区宽度加左、右内边距宽度，clientHeight 是内容区高度加上、下内边距高度。

       客户端尺寸实际上就是元素内部的空间，因此不包含滚动条占用的空间。这两个属性最常用于确定浏览器视口尺寸，即检测 document.documentElement 的 clientWidth 和 clientHeight。这两个属性表示视口（< html>或< body>元素）的尺寸。

    3. 滚动尺寸
       最后一组尺寸是滚动尺寸（scroll dimensions），提供了元素内容滚动距离的信息。有些元素，比如< html>无须任何代码就可以自动滚动，而其他元素则需要使用 CSS 的 overflow 属性令其滚动。滚动尺寸相关的属性有如下 4 个。

       - scrollHeight，没有滚动条出现时，元素内容的总高度。
       - scrollLeft，内容区左侧隐藏的像素数，设置这个属性可以改变元素的滚动位置。
       - scrollTop，内容区顶部隐藏的像素数，设置这个属性可以改变元素的滚动位置。
       - scrollWidth，没有滚动条出现时，元素内容的总宽度。

       scrollWidth 和 scrollHeight 可以用来确定给定元素内容的实际尺寸。例如，< html>元素是浏览器中滚动视口的元素。因此，document.documentElement.scrollHeight 就是整个页面垂直方向的总高度。

       scrollWidth 和 scrollHeight 与 clientWidth 和 clientHeight 之间的关系在不需要滚动的文档上是分不清的。如果文档尺寸超过视口尺寸，则在所有主流浏览器中这两对属性都不相等，scrollWidth 和 scollHeight 等于文档内容的宽度，而 clientWidth 和 clientHeight 等于视口的大小。

       scrollLeft 和 scrollTop 属性可以用于确定当前元素滚动的位置，或者用于设置它们的滚动位置。元素在未滚动时，这两个属性都等于 0。如果元素在垂直方向上滚动，则 scrollTop 会大于 0，表示元素顶部不可见区域的高度。如果元素在水平方向上滚动，则 scrollLeft 会大于 0，表示元素左侧不可见区域的宽度。因为这两个属性也是可写的，所以把它们都设置为 0 就可以重置元素的滚动位置。

    4. 确定元素尺寸
       浏览器在每个元素上都暴露了 getBoundingClientRect()方法，返回一个 DOMRect 对象，包含 6 个属性：left、top、right、bottom、height 和 width。这些属性给出了元素在页面中相对于视口的位置。

### 遍历

DOM2 Traversal and Range 模块定义了两个类型用于辅助顺序遍历 DOM 结构。这两个类型——NodeIterator 和 TreeWalker——从某个起点开始执行对 DOM 结构的深度优先遍历。

如前所述，DOM 遍历是对 DOM 结构的深度优先遍历，至少允许朝两个方向移动（取决于类型）。遍历以给定节点为根，不能在 DOM 中向上超越这个根节点。

1. NodeIterator
   NodeIterator 类型是两个类型中比较简单的，可以通过 document.createNodeIterator()方法创建其实例。这个方法接收以下 4 个参数。

   - root，作为遍历根节点的节点。
   - whatToShow，数值代码，表示应该访问哪些节点。
   - filter，NodeFilter 对象或函数，表示是否接收或跳过特定节点。
   - entityReferenceExpansion，布尔值，表示是否扩展实体引用。这个参数在 HTML 文档中没有效果，因为实体引用永远不扩展。

   whatToShow 参数是一个位掩码，通过应用一个或多个过滤器来指定访问哪些节点。这个参数对应的常量是在 NodeFilter 类型中定义的。

   - NodeFilter.SHOW_ALL，所有节点。
   - NodeFilter.SHOW_ELEMENT，元素节点。
   - NodeFilter.SHOW_ATTRIBUTE，属性节点。由于 DOM 的结构，因此实际上用不上。
   - NodeFilter.SHOW_TEXT，文本节点。
   - NodeFilter.SHOW_CDATA_SECTION，CData 区块节点。不是在 HTML 页面中使用的。
   - NodeFilter.SHOW_ENTITY_REFERENCE，实体引用节点。不是在 HTML 页面中使用的。
   - NodeFilter.SHOW_ENTITY，实体节点。不是在 HTML 页面中使用的。
   - NodeFilter.SHOW_PROCESSING_INSTRUCTION，处理指令节点。不是在 HTML 页面中使用的。
   - NodeFilter.SHOW_COMMENT，注释节点。
   - NodeFilter.SHOW_DOCUMENT，文档节点。
   - NodeFilter.SHOW_DOCUMENT_TYPE，文档类型节点。
   - NodeFilter.SHOW_DOCUMENT_FRAGMENT，文档片段节点。不是在 HTML 页面中使用的。
   - NodeFilter.SHOW_NOTATION，记号节点。不是在 HTML 页面中使用的。

2. TreeWalker  
   TreeWalker 是 NodeIterator 的高级版。除了包含同样的 nextNode()、previousNode()方法，TreeWalker 还添加了如下在 DOM 结构中向不同方向遍历的方法。

   - parentNode()，遍历到当前节点的父节点。
   - firstChild()，遍历到当前节点的第一个子节点。
   - lastChild()，遍历到当前节点的最后一个子节点。
   - nextSibling()，遍历到当前节点的下一个同胞节点。
   - previousSibling()，遍历到当前节点的上一个同胞节点。

   TreeWalker 对象要调用 document.createTreeWalker()方法来创建，这个方法接收与 document.createNodeIterator()同样的参数：作为遍历起点的根节点、要查看的节点类型、节点过滤器和一个表示是否扩展实体引用的布尔值。因为两者很类似，所以 TreeWalker 通常可以取代 NodeIterator。

   不同的是，节点过滤器（filter）除了可以返回 NodeFilter.FILTER_ACCEPT 和 NodeFilter.FILTER_SKIP，还可以返回 NodeFilter.FILTER_REJECT。在使用 NodeIterator 时，NodeFilter.FILTER_SKIP 和 NodeFilter.FILTER_REJECT 是一样的。但在使用 TreeWalker 时，NodeFilter.FILTER_SKIP 表示跳过节点，访问子树中的下一个节点，而 NodeFilter.FILTER_REJECT 则表示跳过该节点以及该节点的整个子树。例如，如果把前面示例中的过滤器函数改为返回 NodeFilter.FILTER_REJECT（而不是 NodeFilter.FILTER_SKIP），则会导致遍历立即返回，不会访问任何节点。这是因为第一个返回的元素是< div>，其中标签名不是"li"，因此过滤函数返回 NodeFilter.FILTER_REJECT，表示要跳过整个子树。因为< div>本身就是遍历的根节点，所以遍历会就此结束。

### 范围

为了支持对页面更细致的控制，DOM2 Traversal and Range 模块定义了范围接口。范围可用于在文档中选择内容，而不用考虑节点之间的界限。（选择在后台发生，用户是看不到的。）范围在常规 DOM 操作的粒度不够时可以发挥作用。

1. DOM 范围
   DOM2 在 Document 类型上定义了一个 createRange()方法，暴露在 document 对象上。使用这个方法可以创建一个 DOM 范围对象。

   与节点类似，这个新创建的范围对象是与创建它的文档关联的，不能在其他文档中使用。然后可以使用这个范围在后台选择文档特定的部分。创建范围并指定它的位置之后，可以对范围的内容执行一些操作，从而实现对底层 DOM 树更精细的控制。

   每个范围都是 Range 类型的实例，拥有相应的属性和方法。下面的属性提供了与范围在文档中位置相关的信息。

   - startContainer，范围起点所在的节点（选区中第一个子节点的父节点）。
   - startOffset，范围起点在 startContainer 中的偏移量。如果 startContainer 是文本节点、注释节点或 CData 区块节点，则 startOffset 指范围起点之前跳过的字符数；否则，表示范围中第一个节点的索引。
   - endContainer，范围终点所在的节点（选区中最后一个子节点的父节点）。
   - endOffset，范围起点在 startContainer 中的偏移量（与 startOffset 中偏移量的含义相同）。
   - commonAncestorContainer，文档中以 startContainer 和 endContainer 为后代的最深的节点。

   这些属性会在范围被放到文档中特定位置时获得相应的值。

2. 简单选择
   通过范围选择文档中某个部分最简单的方式，就是使用 selectNode()或 selectNodeContents()方法。这两个方法都接收一个节点作为参数，并将该节点的信息添加到调用它的范围。selectNode()方法选择整个节点，包括其后代节点，而 selectNodeContents()只选择节点的后代。

3. 复杂选择
   要创建复杂的范围，需要使用 setStart()和 setEnd()方法。这两个方法都接收两个参数：参照节点和偏移量。对 setStart()来说，参照节点会成为 startContainer，而偏移量会赋值给 startOffset。对 setEnd()而言，参照节点会成为 endContainer，而偏移量会赋值给 endOffset。

4. 操作范围
   创建范围之后，浏览器会在内部创建一个文档片段节点，用于包含范围选区中的节点。为操作范围的内容，选区中的内容必须格式完好。在前面的例子中，因为范围的起点和终点都在文本节点内部，并不是完好的 DOM 结构，所以无法在 DOM 中表示。不过，范围能够确定缺失的开始和结束标签，从而可以重构出有效的 DOM 结构，以便后续操作。

   第一个方法最容易理解和使用：deleteContents()。顾名思义，这个方法会从文档中删除范围包含的节点。

   另一个方法 extractContents()跟 deleteContents()类似，也会从文档中移除范围选区。但不同的是，extractContents()方法返回范围对应的文档片段。这样，就可以把范围选中的内容插入文档中其他地方。

   如果不想把范围从文档中移除，也可以使用 cloneContents()创建一个副本，然后把这个副本插入到文档其他地方。

5. 范围插入
   上一节介绍了移除和复制范围的内容，本节来看一看怎么向范围中插入内容。使用 insertNode()方法可以在范围选区的开始位置插入一个节点。

   除了向范围中插入内容，还可以使用 surroundContents()方法插入包含范围的内容。这个方法接收一个参数，即包含范围内容的节点。调用这个方法时，后台会执行如下操作：
   (1) 提取出范围的内容；

   (2) 在原始文档中范围之前所在的位置插入给定的节点；

   (3) 将范围对应文档片段的内容添加到给定节点。

6. 范围折叠
   如果范围并没有选择文档的任何部分，则称为折叠（collapsed）。折叠范围有点类似文本框：如果文本框中有文本，那么可以用鼠标选中以高亮显示全部文本。这时候，如果再单击鼠标，则选区会被移除，光标会落在某两个字符中间。而在折叠范围时，位置会被设置为范围与文档交界的地方，可能是范围选区的开始处，也可能是结尾处。图 16-10 展示了范围折叠时会发生什么。

   折叠范围可以使用 collapse()方法，这个方法接收一个参数：布尔值，表示折叠到范围哪一端。true 表示折叠到起点，false 表示折叠到终点。

7. 范围比较
   如果有多个范围，则可以使用 compareBoundaryPoints()方法确定范围之间是否存在公共的边界（起点或终点）。这个方法接收两个参数：要比较的范围和一个常量值，表示比较的方式。这个常量参数包括：

   - Range.START_TO_START（0），比较两个范围的起点；
   - Range.START_TO_END（1），比较第一个范围的起点和第二个范围的终点；
   - Range.END_TO_END（2），比较两个范围的终点；
   - Range.END_TO_START（3），比较第一个范围的终点和第二个范围的起点。

   compareBoundaryPoints()方法在第一个范围的边界点位于第二个范围的边界点之前时返回-1，在两个范围的边界点相等时返回 0，在第一个范围的边界点位于第二个范围的边界点之后时返回 1。

8. 复制范围
   调用范围的 cloneRange()方法可以复制范围。

9. 清理
   在使用完范围之后，最好调用 detach()方法把范围从创建它的文档中剥离。调用 detach()之后，就可以放心解除对范围的引用，以便垃圾回收程序释放它所占用的内存。
