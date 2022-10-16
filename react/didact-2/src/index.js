
let wipRoot = null
let nextUnitOfWork = null
let currentRoot = null
// let states = {
//     num: 0,
// }
let deletions = null

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'object' ? child : createTextElement(child))
        }
    }
}

function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}


function createDom(fiber) {
    const dom =
        fiber.type === "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props)
    return dom
}

function render(element, root) {
    wipRoot = {
        dom: root,
        props: {
            children: [element]
        },
        alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
}

function commitRoot() {
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) {
        return
    }
    // console.log(fiber)

    let parentFiber = fiber.parent
    while (!parentFiber.dom) {
        parentFiber = parentFiber.parent
    }
    const parentDom = parentFiber.dom
    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
        parentDom.appendChild(fiber.dom)
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
        updateDom(
            fiber.dom,
            fiber.alternate.props,
            fiber.props
        )
    } else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, parentDom)
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)

const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (next) => key => !(key in next)

function updateDom(dom, oldProps, newProps) {
    Object.keys(oldProps)
        .filter(isEvent)
        .filter(key => !(key in oldProps) || isNew(oldProps, newProps)(key))
        .forEach(key => {
            const eventType = key.toLowerCase().substring(2)
            dom.removeEventListener(
                eventType,
                oldProps[key]
            )
        })

    Object.keys(oldProps)
        .filter(isProperty)
        .filter(isGone(newProps))
        .forEach(key => {
            dom[key] = ''
        })

    Object.keys(newProps)
        .filter(isProperty)
        .filter(isNew(oldProps, newProps))
        .forEach(key => {
            dom[key] = newProps[key]
        })

    Object.keys(newProps)
        .filter(isEvent)
        .filter(isNew(oldProps, newProps))
        .forEach(key => {
            const eventType = key.toLowerCase().substring(2)
            dom.addEventListener(eventType, newProps[key])
        })
}

function commitDeletion(fiber, parentDom) {
    if (fiber.dom) {
        parentDom.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child, parentDom)
    }
}

function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    if (fiber.type instanceof Function) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    if (fiber.child) {
        return fiber.child
    }
    let siblingFiber = fiber
    while (siblingFiber) {
        if (siblingFiber.sibling) {
            return siblingFiber.sibling
        }
        siblingFiber = siblingFiber.parent
    }
}

function updateFunctionComponent(fiber) {
    hookFiber = fiber
    hookIndex = 0
    hookFiber.hooks = []
    const elements = [fiber.type(fiber.props)]
    reconcileChildren(elements, fiber)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    const elements = fiber.props.children

    reconcileChildren(elements, fiber)
}

function reconcileChildren(elements, fiber) {
    let index = 0
    let prevSibling = null

    let oldFiber = fiber.alternate && fiber.alternate.child

    while (index < elements.length || oldFiber != null) {
        const element = elements[index]
        let newFiber = null

        const sameType = oldFiber && element && element.type == oldFiber.type

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: fiber,
                alternate: oldFiber,
                effectTag: "UPDATE"
            }
        } else if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: fiber,
                alternate: null,
                effectTag: "PLACEMENT"
            }
        } else if (oldFiber && !sameType) {
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber

        index++
    }
}

let hookFiber = null
let hookIndex = null

function useState(init) {
    const oldHook = hookFiber && hookFiber.alternate && hookFiber.alternate.hooks[hookIndex]
    const hook = {
        state: oldHook ? oldHook.state : init,
        queue: []
    }
    const actions = oldHook ? oldHook.queue : []
    actions.forEach(action => {
        hook.state = action(hook.state)
    })


    const setState = action => {
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

const myReact = {
    render,
    createElement,
    useState
}

/** @jsx myReact.createElement */
function Counter() {
    const [state, setState] = myReact.useState(1)
    return (
        <div>
            <h1>你好，世界</h1>
            <div onClick={() => { setState(c => c + 1) }}>
                点击+{state}
            </div>
        </div>
    )
}
const element = <Counter />
const container = document.getElementById("root")
myReact.render(element, container)
