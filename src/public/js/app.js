const messageList = document.querySelector('ul');
const messageForm = document.querySelector('#message');
const nickNameForm = document.querySelector('#nick');

const backSocket = new WebSocket(`ws://${window.location.host}`);

backSocket.addEventListener('open', () => {
  console.log('Connected to Server ✅');
});

backSocket.addEventListener('message', (message) => {
  const data = JSON.parse(message.data);
  const li = document.createElement('li');
  li.textContent = `${data.type} : ${data.payload}`;
  messageList.append(li);
});

backSocket.addEventListener('close', () => console.log('disconnected from Server ❌'));

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  backSocket.send(input.value);
  input.value = '';
});

nickNameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = nickNameForm.querySelector('input');
  backSocket.send(
    JSON.stringify({
      type: 'nickname',
      payload: input.value,
    })
  );
});
