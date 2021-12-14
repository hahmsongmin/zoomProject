const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('#roomName');
const room = document.getElementById('room');
const nick = document.getElementById('nickName');
const nickform = welcome.querySelector('#nickName');

let roomName;
let nickName;
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
  nick.hidden = true;
  room.hidden = false;
  enterName.textContent = `방이름 : ${roomName} ⭐️ `;
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
  if (nickName) {
    socket.emit('enter_room', input.value, showRoom);
    roomName = input.value;
    input.value = '';
  } else {
    const nickInput = nickform.querySelector('input');
    nickInput.focus();
    nickInput.placeholder = '닉네임을 입력해주세요';
  }
});

nickform.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = nickform.querySelector('input');
  nickName = input.value;
  socket.emit('nickname', input.value);
});

socket.on('welcome', (user, newCount) => {
  const enterName = room.querySelector('h3');
  enterName.textContent = `방이름 : ${roomName} ⭐️   참가인원 : ${newCount}`;
  addMessage(`${user}님이 참가하였습니다.`);
});

socket.on('bye', (user, newCount) => {
  const enterName = room.querySelector('h3');
  enterName.textContent = `방이름 : ${roomName} ⭐️  참가인원 : ${newCount}`;
  addMessage(`${user}님이 떠나셨습니다.`);
});

socket.on('new_message', addMessage);
socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.textContent = room;
    roomList.append(li);
  });
});
