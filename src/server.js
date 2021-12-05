import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

// Secure Web Socket(WSS)

const app = express();
const PORT = 8000;

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const logServer = () => console.log(`✅ http && ws 🚀 Node Server => http://localhost:${PORT}/`);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

// 각 전달 받은 frontSocket을 push 해줘서 관리하면, 다른 모든 Socket에 전달해 줄 수 있음
// 예를 들어 (브레이브 => , 파이어폭스 => ) 각각 frontsocket을 넣어줌
const fakeSocketsDatabase = [];

wss.on('connection', (frontSocket) => {
  fakeSocketsDatabase.push(frontSocket);
  console.log('Connected to Browser ✅');
  frontSocket.on('close', () => console.log('disconneted to Browser ❌'));
  frontSocket.on('message', (message) => {
    const decordingMeg = message.toString('utf8');
    fakeSocketsDatabase.forEach((eachSocket) => eachSocket.send(decordingMeg));
  });
});

server.listen(PORT, logServer);
