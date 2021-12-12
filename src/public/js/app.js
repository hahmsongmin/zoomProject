const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

let roomName;
room.hidden = true;

function showRoom() {
  const enterName = room.querySelector('h3');
  welcome.hidden = true;
  room.hidden = false;
  enterName.textContent = `방이름 : ${roomName}`;
}

function addMessage(message) {
  console.log(message);
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
