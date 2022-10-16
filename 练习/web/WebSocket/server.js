// 引入express和ws
const express = require("express");
const SocketServer = require("ws").Server;

// 指定开启的端口
const PORT = 3001;

// 创建express，绑定监听3001端口，且设定开启后在console中提示
const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

// 将express交给SocketServer开启webSocket的服务
const wss = new SocketServer({ server });
// 当WebSocket从外部连接时执行
wss.on("connection", (ws) => {
  // 连接时执行此console提示
  console.log("Client connection");

  // 固定发送最新消息给客户端
  //   const sendNowTime = setInterval(() => {
  //     ws.send(String(new Date()));
  //   }, 1000);

  // 对message设置监听，接收从客户端发送的消息
  //   ws.on("message", (data) => {
  //     // data为客户端发送的消息，将消息原封不动返回回去
  //     ws.send(data);
  //   });

  // 对message设置监听，接收从客户端发送的消息
  ws.on("message", (data) => {
    // 取得所有连接中的客户端
    let clients = wss.clients;
    // 循环，发送消息至每个客户端
    clients.forEach((client) => {
      client.send(data);
    });
  });

  // 当WebSocket的连接关闭时执行
  ws.on("close", () => {
    console.log("Close connection");
  });
});


