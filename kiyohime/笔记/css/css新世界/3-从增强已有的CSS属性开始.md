## 从增强已有的 CSS 属性开始

### 贯穿全书的尺寸体系

1. 从 width:fit-content 声明开始

   fit-content 关键字是新的尺寸体系关键字中使用频率最高的关键字。你可以把 fit-content 关键字的尺寸表现想象成“紧身裤”，大腿的肉对应的就是元素里面的内容，如果是宽松的裤子，那肉眼所见的尺寸就比较大，但是如果是紧身裤，则呈现的尺寸就是大腿实际的尺寸。同样，元素应用 fit-content 关键字就像给元素里面的内容穿上了超薄紧身裤，此时元素的尺寸就是里面内容的尺寸。

   实际上，fit-content 关键字的样式表现就是 CSS2.1 规范中的“shrink-to-fit”，我称其为“包裹性”。这种尺寸表现和元素应用 display:inline-block、position:absolute 等 CSS 声明类似，尺寸收缩但不会超出包含块级元素的尺寸限制。

2. stretch、available 和 fill-available 关键字究竟用哪个

   stretch、available 和 fill-available 这 3 个关键字虽然名称有所不同，但是作用都是一致的，那就是让元素的尺寸自动填满可用空间，就如同< div>;元素的默认尺寸表现。

   下面问题来了，究竟该使用 stretch、available 和 fill-available 这 3 个关键字中的哪一个呢？先简单分析一下这 3 个关键字。

   - stretch 指“弹性拉伸”，是最新的规范中定义的关键字，替换之前的 fill-available 和 available。
   - available 指“可用空间”，是 Firefox 浏览器使用的关键字，需要配合-moz-私有前缀使用。
   - fill-available 指“填充可用空间”，是 webkit 浏览器使用的关键字，需要配合-webkit-私有前缀使用。

3. 深入了解 min-content 关键字

   min-content 关键字实际上就是 CSS2.1 规范中提到的“preferred minimum width”或者“minimum content width”，即“首选最小宽度”或者“最小内容宽度”。

   “首选最小宽度”在《CSS 世界》一书的第 22 页（3.2.1 节）中有过简单的介绍，这里再把最小宽度规则深入讲解一下。

### 深入了解 CSS 逻辑属性

1. CSS 逻辑属性有限的使用场景
   writing-mode、direction 和 text-orientation 属性都不是常用 CSS 属性，这就导致 CSS 逻辑属性的使用场景非常有限。有些人可能会说，平常使用 margin-inline-end 属性代替 margin-right 属性不就好了？对，但是这样做没有必要，因为 margin-right 属性兼容性更好，且更容易理解，再怎么考虑也不会想到使用 margin-inline-end 属性代替。

   当然，也存在非常适合使用 CSS 逻辑属性的场景，那就是对称布局。

2. inline/block 与 start/end 元素
   以 margin 属性为例，在中文或英文网页环境中，默认情况下，margin 方位属性和 margin 逻辑属性相互的映射关系如下：

   margin-left ↔ margin-inline-start
   margin-top ↔ margin-block-start
   margin-right ↔ margin-inline-end
   margin-bottom ↔ margin-block-end

   其中，inline/block 表示方向，start/end 表示起止方位。

   在中文和英文网页环境中，inline 元素（文字、图片、按钮等）默认是从左往右水平排列的；block 元素（如<div>、<p>元素等）默认是从上往下垂直排列的。因此，margin-inline-start 就表示内联元素排列方向的起始位置，即“左侧”；margin-inline-end 就表示内联元素排列方向的终止位置，即“右侧”。

3. width/height 属性与 inline-size/block-size 逻辑属性
   在中文或英文网页环境中，默认情况下，width 属性对应的 CSS 逻辑属性是 inline-size，height 属性对应的 CSS 逻辑属性是 block-size。

4. 由 margin/padding/border 演变而来的逻辑属性
   margin 和 padding 属性对应的 CSS 逻辑属性很早就被支持了，最早可以追溯到 2008 年，然而当时使用的不是现在的语法，且只支持水平方向上的逻辑控制，同时需要添加私有前缀。

   在规范稳定之后，margin、padding 和 border 属性一起，演变成了按照 inline/block 与 start/end 这几个关键字组合的新的 CSS 逻辑属性，无须私有前缀。

5. text-align 属性支持的逻辑属性值
   对 text-align 属性而言，演变的不是属性而是属性值。

   - text-align: start。
   - text-align: end。

6. 最有用的 CSS 逻辑属性 inset
   使用绝对定位的时候经常会用到 left、top、right、bottom 等属性。同样，在 CSS 新世界中也有与之相对应的 CSS 逻辑属性，全部都是以 inset 开头，这其中包括：

   - inset-inline-start；
   - inset-inline-end；
   - inset-block-start；
   - inset-block-end。

   也包括水平方位或者垂直方位的缩写：

   - inset-inline；
   - inset-inline；
   - inset-block；
   - inset-block。

   还包括完整的缩写：

   - inset。

### 在 CSS 边框上做文章

一个图形元素的装饰部件主要是边框和背景。在 CSS2.1 时代，边框只能是纯色的，效果太单调了。于是 CSS 规范制定者就开始琢磨，是不是可以在 CSS 边框上做文章，通过支持图片显示来增强边框的表现力呢？

1. 昙花一现的 CSS 多边框

2. 独一无二的 border-image 属性
   所有与装饰有关的 CSS 属性都能从其他设计软件中找到对应的功能，如背景、描边、阴影，甚至滤镜和混合模式，但是唯独 border-image 属性是 CSS 这门语言独有的，就算其他软件有边框装饰，也不是 border-image 这种表现机制。

   这看起来是件好事情，你瞧，border-image 多么与众不同！但实际上，border-image 属性很少出现在项目代码中，其中重要的原因之一就是 border-image 属性过于特殊。

3. border-image 属性与渐变边框

### position 属性的增强

本节主要介绍一个全新的 position 属性值——sticky，单词“sticky”的中文意思是“黏性的”，position:sticky 就是黏性定位。

sticky 属性值刚出来的时候，在圈子里是引发过一阵小热度的。但是，在 2014 年至 2016 年这长达 3 年的时间里，Chrome 浏览器放弃了对它的支持，后来这个新特性就淡出了大众的视野。不知道出于什么原因，2017 年之后，Chrome 浏览器又重新开始支持黏性定位了。目前所有主流浏览器都已经支持黏性定位。

1. 深入了解 sticky 属性值与黏性定位
   过去，黏性定位效果一定是通过 JavaScript 代码实现的。这个效果常用在导航元素上，具体表现为：当导航元素在屏幕内的时候，导航元素滚动跟随；当导航元素就要滚出屏幕的时候，导航元素固定定位。

   sticky 属性值的设计初衷就是把原来 JavaScript 才能实现的黏性效果改由 CSS 实现。

   1. 可滚动元素对黏性定位的影响
      通常的 Web 页面都是窗体滚动的，而黏性定位偏移计算的元素是层级最近的那个滚动元素。因此，如果黏性定位元素的某个祖先元素的 overflow 属性值不是 visible，那么窗体滚动的时候就不会有黏性定位效果。

2. position:sticky 声明的精彩应用——层次滚动

### font-family 属性和@font-face 规则新特性

1. system-ui 等全新的通用字体族
   字体族表示一个系列字体，而非单指具体某一个字体。字体族又分为普通字体族和通用字体族，例如 Arial 就是普通字体族。

   1. system-ui 通用字体族
      在过去，如果想要使用系统字体，只能使用 font:menu、font:status-bar 等 CSS 声明。但是，menu、status-bar、small-caption 等 font 关键字属性值是包含字号的，不同操作系统中的字号会不一样，因此我们还需要通过设置 font-size 属性值重置字号大小，比较麻烦。
