// 使用WebSocket的地址向服务器开启连接
let ws = new WebSocket("ws://localhost:3001");
let click = document.querySelector(".button");
let input = document.querySelector(".input");
let pull = document.querySelector(".pull");
let one = true;

// 开启后的动作，指定在连接后执行的事件
ws.onopen = () => {
  console.log("open connection");
};

// 接收服务端发送的消息
ws.onmessage = (event) => {
  console.log(event);
  let { data } = event;
  if (data.length === 0) return;
  if (one) {
    pull.innerHTML = event.data;
    one = false;
  } else {
    pull.innerHTML = `${pull.innerHTML}<br/>${event.data}`;
  }
};

// 指定在关闭后执行的事件
ws.onclose = () => {
  console.log("Close connection");
};

click.addEventListener("click", function () {
  ws.send(input.value);
});
