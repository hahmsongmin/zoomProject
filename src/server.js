import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { instrument } from '@socket.io/admin-ui';

// Secure Web Socket(WSS)

const app = express();
const PORT = 8000;

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on('connection', (socket) => {
  socket.onAny((event) => {
    console.log(`What is the roomName : ${event}`);
  });
  socket.on('enter_room', (roomName, callback) => {
    socket.join(roomName);
    callback();
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
    wsServer.sockets.emit('room_change', publicRooms());
  });
  socket.on('new_message', (message, roomName, callback) => {
    socket.to(roomName).emit('new_message', `${socket.nickname} : ${message}`);
    callback();
  });
  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1);
    });
  });
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms());
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
