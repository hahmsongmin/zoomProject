const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

let roomName;
room.hidden = true;

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector('input');
  const save = input.value;
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You : ${save}`);
  });
  input.value = '';
}

function showRoom() {
  const enterName = room.querySelector('h3');
  welcome.hidden = true;
  room.hidden = false;
  enterName.textContent = `방이름 : ${roomName}`;
  const form = room.querySelector('form');
  form.addEventListener('submit', handleMessageSubmit);
}

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.textContent = message;
  ul.appendChild(li);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
});

socket.on('welcome', () => {
  addMessage('someone joined');
});

socket.on('bye', () => {
  addMessage('bye bye');
});

socket.on('new_message', addMessage);
