import express from 'express';
import SocketIO from 'socket.io';
import http from 'http';

// Secure Web Socket(WSS)

const app = express();
const PORT = 8000;

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', (socket) => {
  socket.on('enter_room', (msg, callback) => {
    console.log(msg);
    setTimeout(() => {
      callback();
    }, 2000);
  });
});

// 각 전달 받은 frontSocket을 push 해줘서 관리하면, 다른 모든 Socket에 전달해 줄 수 있음
// 예를 들어 (브레이브 => , 파이어폭스 => ) 각각 frontsocket을 넣어줌
// const fakeSocketsDatabase = [];
// wss.on('connection', (frontSocket) => {
//   fakeSocketsDatabase.push(frontSocket);
//   frontSocket.nickname = 'anoy';
//   console.log('Connected to Browser ✅');
//   frontSocket.on('close', () => console.log('disconneted to Browser ❌'));
//   frontSocket.on('message', (message) => {
//     const decordingMeg = JSON.parse(message.toString('utf8'));
//     switch (decordingMeg.type) {
//       case 'new_message':
//         fakeSocketsDatabase.forEach((eachSocket) => {
//           if (frontSocket.myCheck === eachSocket.nickname) {
//             return;
//           }
//           eachSocket.send(`${frontSocket.nickname} : ${decordingMeg.payload}`);
//         });
//         break;
//       case 'nickname':
//         frontSocket.nickname = decordingMeg.payload;
//         frontSocket.myCheck = decordingMeg.payload;
//         break;
//     }
//   });
// });

const logServer = () => console.log(`✅ http && ws 🚀 Node Server => http://localhost:${PORT}/`);

httpServer.listen(PORT, logServer);
