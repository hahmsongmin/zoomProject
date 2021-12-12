const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = form.querySelector('input');
  // 세번째 arg 는 서버로 부터 실행되는 callback 함수
  // callback 함수는 프론트에 있음(중요..)
  socket.emit('enter_room', { payload: input.value }, () => {
    console.log('server is done!');
  });
  input.value = '';
});
