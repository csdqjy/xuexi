import _ from 'lodash'
import printMe from './print'

function component() {
    const element = document.createElement('DIV')
    const btn = document.createElement('BUTTON')

    element.innerHTML = _.join(['hello', 'webpack'], '')
    btn.innerHTML = '点击'
    btn.onclick = printMe

    element.appendChild(btn)

    return element
}

document.body.appendChild(component())