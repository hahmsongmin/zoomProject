const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');

const backSocket = new WebSocket(`ws://${window.location.host}`);

backSocket.addEventListener('open', () => {
  console.log('Connected to Server ✅');
});

backSocket.addEventListener('message', (message) => {
  console.log(message.data);
});

backSocket.addEventListener('close', () => console.log('disconnected from Server ❌'));

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  backSocket.send(input.value);
  input.value = '';
});
