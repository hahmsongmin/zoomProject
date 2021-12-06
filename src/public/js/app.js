const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickNameForm = document.querySelector('#nick');

const backSocket = new WebSocket(`ws://${window.location.host}`);

backSocket.addEventListener('open', () => {
  console.log('Connected to Server ✅');
});

backSocket.addEventListener('message', (message) => {
  const msg = message.data;
  const li = document.createElement('li');
  li.textContent = msg;
  messageList.append(li);
});

backSocket.addEventListener('close', () => console.log('disconnected from Server ❌'));

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

nickNameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = nickNameForm.querySelector('input');
  backSocket.send(makeMessage('nickname', input.value));
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  backSocket.send(makeMessage('new_message', input.value));
  const li = document.createElement('li');
  li.textContent = `You : ${input.value}`;
  messageList.append(li);
  input.value = '';
});
