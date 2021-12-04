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

wss.on('connection', (frontSocket) => {
  console.log('Connected to Browser ✅');
  frontSocket.on('close', () => console.log('disconneted to Browser ❌'));
  frontSocket.on('message', (message) => console.log(message.toString('utf8')));
  frontSocket.send('Hello!!');
});

server.listen(PORT, logServer);
