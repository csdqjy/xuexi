
async function getComponent() {
    const element = document.createElement('div');
    const { default: _ } = await import('lodash');

    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    // btn.innerHTML = 'Click me and check the console!';
    // btn.onclick = printMe;
    // element.appendChild(btn);
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element
}

getComponent().then((component) => {
    document.body.appendChild(component);
});