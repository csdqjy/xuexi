function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

const isEvent = key => key.startsWith("on") // 判断props是否以on开头的事件
const isProperty = key => key !== "children" && !isEvent(key)
const isNew = (prev, next) => key => prev[key] !== next[key] // 判断是否为新的props
const isGone = (prev, next) => key => !(key in next)  // 判断next中不存在的props
// let a = { 1: '', 2: '' }
// console.log([1, 2, 3, 4].filter(key => !(key in a) || (key => console.log(key))(key)))
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners 设置on事件删除
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key)) // 判断在新props中是否存在
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)

      // 如果不存在就删除事件
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

  // Remove old properties 将老的不存在的props设置为空
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // Set new or changed properties 设置新的props
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // Add event listeners 添加on事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps)) // 判断是否为新的on事件
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

function commitRoot() { // 将虚拟dom提交到真实dom上
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  // 将这次的dom树存到currentRoot
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent // 向上寻找直到找到一个带dom属性的元素
  }
  const domParent = domParentFiber.dom

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    console.log(fiber)
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitDeletion(fiber, domParent) {
  // 向下找到第一个带dom的元素，删除
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

function render(element, container) { // element：jsx，container：根元素的dom元素
  wipRoot = { // wipRoot，根元素的虚拟dom
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot, // alternate：旧的虚拟dom
  }
  deletions = [] // dom删除列表
  nextUnitOfWork = wipRoot // 下一个节点的虚拟dom
}

let nextUnitOfWork = null // 下一个fiber
let currentRoot = null    // 上一次的dom树
let wipRoot = null        // 
let deletions = null      // 要删除的元素集合

function workLoop(deadline) {
  // deadline:requestIdleCallback的参数，timeRemaining():当前帧还剩下多少时间
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // console.log(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1 // 如果当前帧没时间了就暂停
  }

  if (!nextUnitOfWork && wipRoot) { // 如果遍历完了fiber树，则执行渲染
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

// requestIdleCallback类似setTimeout，但是是在浏览器空闲时才会运行回调
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  console.log(fiber)
  // 判断是否为function组件
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    // 是函数组件
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

let hookFiber = null
let hookIndex = null

// function组件的方法
function updateFunctionComponent(fiber) {
  hookFiber = fiber
  hookIndex = 0
  hookFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function useState(initial) {
  const oldHook =
    hookFiber.alternate &&
    hookFiber.alternate.hooks &&
    hookFiber.alternate.hooks[hookIndex] // 判断是否有旧hooks

  const hook = {
    state: oldHook ? oldHook.state : initial, // 有旧hooks就拿旧hooks的state，没有就赋值新state
    queue: [],
  }

  const actions = oldHook ? oldHook.queue : [] // 
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = action => {
    // action：回调函数
    hook.queue.push(action) // 为hook事件池中添加action
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }
  hookFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

// 类组件的方法
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  const elements = fiber.props.children
  // console.log(fiber)
  // fiber:父元素 elements:子元素集合
  reconcileChildren(fiber, elements)
}

function reconcileChildren(wipFiber, elements) { // wipFiber:父元素 elements:子元素集合
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (index < elements.length || oldFiber != null) {
    const element = elements[index]

    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    if (sameType) {
      // TODO update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      // TODO add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      // TODO delete the oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

}

const Didact = {
  createElement,
  render,
  useState
};

// const container = document.getElementById("root")

// const updateValue = e => {
//   rerender(e.target.value)
// }

// const rerender = value => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   )
//   Didact.render(element, container)
// }

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1)
  return (
    <h1 onClick={() => {
      setState(c => c + 1)
    }}>
      Count: {state}
    </h1>
  )
}

const element = <Counter />
const container = document.getElementById("root")
Didact.render(element, container)

