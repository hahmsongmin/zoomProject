const backSocket = new WebSocket(`ws://${window.location.host}`);

backSocket.addEventListener('open', () => {
  console.log('Connected to Server ✅');
});

backSocket.addEventListener('message', (message) => {
  console.log(message.data);
});

backSocket.addEventListener('close', () => console.log('disconnected from Server ❌'));

setTimeout(() => {
  backSocket.send('Hello from the browser!!');
}, 10000);
