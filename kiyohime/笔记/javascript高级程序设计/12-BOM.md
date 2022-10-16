## BOM

虽然 ECMAScript 把浏览器对象模型（BOM，Browser Object Model）描述为 JavaScript 的核心，但实际上 BOM 是使用 JavaScript 开发 Web 应用程序的核心。BOM 提供了与网页无关的浏览器功能对象。多年来，BOM 是在缺乏规范的背景下发展起来的，因此既充满乐趣又问题多多。毕竟，浏览器开发商都按照自己的意愿来为它添砖加瓦。最终，浏览器实现之间共通的部分成为了事实标准，为 Web 开发提供了浏览器间互操作的基础。HTML5 规范中有一部分涵盖了 BOM 的主要内容，因为 W3C 希望将 JavaScript 在浏览器中最基础的部分标准化。

### window 对象

BOM 的核心是 window 对象，表示浏览器的实例。window 对象在浏览器中有两重身份，一个是 ECMAScript 中的 Global 对象，另一个就是浏览器窗口的 JavaScript 接口。这意味着网页中定义的所有对象、变量和函数都以 window 作为其 Global 对象，都可以访问其上定义的 parseInt()等全局方法。

1. Global 作用域
   因为 window 对象被复用为 ECMAScript 的 Global 对象，所以通过 var 声明的所有全局变量和函数都会变成 window 对象的属性和方法

2. 窗口关系
   top 对象始终指向最上层（最外层）窗口，即浏览器窗口本身。而 parent 对象则始终指向当前窗口的父窗口。如果当前窗口是最上层窗口，则 parent 等于 top（都等于 window）。最上层的 window 如果不是通过 window.open()打开的，那么其 name 属性就不会包含值，本章后面会讨论。

   还有一个 self 对象，它是终极 window 属性，始终会指向 window。实际上，self 和 window 就是同一个对象。之所以还要暴露 self，就是为了和 top、parent 保持一致。

   这些属性都是 window 对象的属性，因此访问 window.parent、window.top 和 window.self 都可以。这意味着可以把访问多个窗口的 window 对象串联起来，比如 window.parent.parent。

3. 窗口位置与像素比
   window 对象的位置可以通过不同的属性和方法来确定。现代浏览器提供了 screenLeft 和 screenTop 属性，用于表示窗口相对于屏幕左侧和顶部的位置 ，返回值的单位是 CSS 像素。

   可以使用 moveTo()和 moveBy()方法移动窗口。这两个方法都接收两个参数，其中 moveTo()接收要移动到的新位置的绝对坐标 x 和 y；而 moveBy()则接收相对当前位置在两个方向上移动的像素数

4. 窗口大小
   在不同浏览器中确定浏览器窗口大小没有想象中那么容易。所有现代浏览器都支持 4 个属性：innerWidth、innerHeight、outerWidth 和 outerHeight。outerWidth 和 outerHeight 返回浏览器窗口自身的大小（不管是在最外层 window 上使用，还是在窗格<frame>中使用）。innerWidth 和 innerHeight 返回浏览器窗口中页面视口的大小（不包含浏览器边框和工具栏）。

5. 视口位置
   浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过滚动在有限的视口中查看文档。度量文档相对于视口滚动距离的属性有两对，返回相等的值：window.pageXoffset/window.scrollX 和 window.pageYoffset/window.scrollY。

   这几个方法也都接收一个 ScrollToOptions 字典，除了提供偏移值，还可以通过 behavior 属性告诉浏览器是否平滑滚动。

6. 导航与打开新窗口
   window.open()方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。这个方法接收 4 个参数：要加载的 URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值。通常，调用这个方法时只传前 3 个参数，最后一个参数只有在不打开新窗口时才会使用。

7. 定时器
   JavaScript 在浏览器中是单线程执行的，但允许使用定时器指定在某个时间之后或每隔一段时间就执行相应的代码。setTimeout()用于指定在一定时间后执行某些代码，而 setInterval()用于指定每隔一段时间执行某些代码。

8. 系统对话框
   使用 alert()、confirm()和 prompt()方法，可以让浏览器调用系统对话框向用户显示消息。这些对话框与浏览器中显示的网页无关，而且也不包含 HTML。它们的外观由操作系统或者浏览器决定，无法使用 CSS 设置。此外，这些对话框都是同步的模态对话框，即在它们显示的时候，代码会停止执行，在它们消失以后，代码才会恢复执行。

   alert()方法在本书示例中经常用到。它接收一个要显示给用户的字符串。与 console.log 可以接收任意数量的参数且能一次性打印这些参数不同，alert()只接收一个参数。调用 alert()时，传入的字符串会显示在一个系统对话框中。对话框只有一个“OK”（确定）按钮。如果传给 alert()的参数不是一个原始字符串，则会调用这个值的 toString()方法将其转换为字符串。

### location 对象

location 是最有用的 BOM 对象之一，提供了当前窗口中加载文档的信息，以及通常的导航功能。这个对象独特的地方在于，它既是 window 的属性，也是 document 的属性。也就是说，window.location 和 document.location 指向同一个对象。location 对象不仅保存着当前加载文档的信息，也保存着把 URL 解析为离散片段后能够通过属性访问的信息。这些解析后的属性在下表中有详细说明（location 前缀是必需的）。

1. 查询字符串
   location 的多数信息都可以通过上面的属性获取。但是 URL 中的查询字符串并不容易使用。虽然 location.search 返回了从问号开始直到 URL 末尾的所有内容，但没有办法逐个访问每个查询参数。

   URLSearchParams 提供了一组标准 API 方法，通过它们可以检查和修改查询字符串。给 URLSearchParams 构造函数传入一个查询字符串，就可以创建一个实例。这个实例上暴露了 get()、set()和 delete()等方法，可以对查询字符串执行相应操作。

2. 操作地址
   可以通过修改 location 对象修改浏览器的地址。首先，最常见的是使用 assign()方法并传入一个 URL，
   如果给 location.href 或 window.location 设置一个 URL，也会以同一个 URL 值调用 assign()方法。
   修改 location 对象的属性也会修改当前加载的页面。其中，hash、search、hostname、pathname 和 port 属性被设置为新值之后都会修改当前 URL。除了 hash 之外，只要修改 location 的一个属性，就会导致页面重新加载新 URL。
   在以前面提到的方式修改 URL 之后，浏览器历史记录中就会增加相应的记录。当用户单击“后退”按钮时，就会导航到前一个页面。如果不希望增加历史记录，可以使用 replace()方法。这个方法接收一个 URL 参数，但重新加载后不会增加历史记录。调用 replace()之后，用户不能回到前一页。
   最后一个修改地址的方法是 reload()，它能重新加载当前显示的页面。调用 reload()而不传参数，页面会以最有效的方式重新加载。也就是说，如果页面自上次请求以来没有修改过，浏览器可能会从缓存中加载页面。如果想强制从服务器重新加载，可以像下面这样给 reload()传个 true。

### navigator 对象

    navigator是由Netscape Navigator 2最早引入浏览器的，现在已经成为客户端标识浏览器的标准。只要浏览器启用JavaScript，navigator对象就一定存在。但是与其他BOM对象一样，每个浏览器都支持自己的属性。

    navigator 对象实现了 NavigatorID、NavigatorLanguage、NavigatorOnLine、NavigatorContentUtils、NavigatorStorage、NavigatorStorageUtils、NavigatorConcurrentHardware、NavigatorPlugins 和 NavigatorUserMedia 接口定义的属性和方法。

1. 检测插件
   检测浏览器是否安装了某个插件是开发中常见的需求。除 IE10 及更低版本外的浏览器，都可以通过 plugins 数组来确定。这个数组中的每一项都包含如下属性。

   - name：插件名称。
   - description：插件介绍。
   - filename：插件的文件名。
   - length：由当前插件处理的 MIME 类型数量。

2. 注册处理程序
   现代浏览器支持 navigator 上的（在 HTML5 中定义的）registerProtocolHandler()方法。这个方法可以把一个网站注册为处理某种特定类型信息应用程序。随着在线 RSS 阅读器和电子邮件客户端的流行，可以借助这个方法将 Web 应用程序注册为像桌面软件一样的默认应用程序。

   要使用 registerProtocolHandler()方法，必须传入 3 个参数：要处理的协议（如"mailto"或"ftp"）、处理该协议的 URL，以及应用名称。

### screen 对象

    window的另一个属性screen对象，是为数不多的几个在编程中很少用的JavaScript对象。这个对象中保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像素高度。每个浏览器都会在screen对象上暴露不同的属性。

### history 对象

    history对象表示当前窗口首次使用以来用户的导航历史记录。因为history是window的属性，所以每个window都有自己的history对象。出于安全考虑，这个对象不会暴露用户访问过的URL，但可以通过它在不知道实际URL的情况下前进和后退。

1. 导航
   go()方法可以在用户历史记录中沿任何方向导航，可以前进也可以后退。这个方法只接收一个参数，这个参数可以是一个整数，表示前进或后退多少步。负值表示在历史记录中后退（类似点击浏览器的“后退”按钮），而正值表示在历史记录中前进（类似点击浏览器的“前进”按钮）。

   在旧版本的一些浏览器中，go()方法的参数也可以是一个字符串，这种情况下浏览器会导航到历史中包含该字符串的第一个位置。最接近的位置可能涉及后退，也可能涉及前进。如果历史记录中没有匹配的项，则这个方法什么也不做。

   history 对象还有一个 length 属性，表示历史记录中有多个条目。这个属性反映了历史记录的数量，包括可以前进和后退的页面。对于窗口或标签页中加载的第一个页面，history.length 等于 1。

2. 历史状态管理
   现代 Web 应用程序开发中最难的环节之一就是历史记录管理。用户每次点击都会触发页面刷新的时代早已过去，“后退”和“前进”按钮对用户来说就代表“帮我切换一个状态”的历史也就随之结束了。为解决这个问题，首先出现的是 hashchange 事件（第 17 章介绍事件时会讨论）。HTML5 也为 history 对象增加了方便的状态管理特性。

   hashchange 会在页面 URL 的散列变化时被触发，开发者可以在此时执行某些操作。而状态管理 API 则可以让开发者改变浏览器 URL 而不会加载新页面。为此，可以使用 history.pushState()方法。这个方法接收 3 个参数：一个 state 对象、一个新状态的标题和一个（可选的）相对 URL。
