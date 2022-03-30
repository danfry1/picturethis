const { Server } = require('socket.io');

const io = new Server({
  cors: {
    origin: 'http://localhost:8080',
  },
});

let players = [];
let user = Object.values(players);
console.log('user', user);
const userArray = [];
let connectionsCounter = 0;

io.on('connection', (socket) => {
  socket.on('chat message', ({ message, data }) => {
    let user = players.find((user) => user.id === data);
    io.emit('chat message', { message: message, user: user, guessed: false });
  });
  socket.on('draw', (data) => {
    io.emit('draw', data);
  });
  socket.on('clear', () => {
    io.emit('clear');
  });
  socket.on('navigate', () => {
    io.emit('navigate', players[Math.floor(Math.random() * players.length)]);
  });
  socket.on('start', (word) => {
    io.emit('start', word);
  });
  socket.on('updateStores', (data) => {
    console.log('a user ' + data + ' connected');
    connectionsCounter++;
    // players[socket.id] = data;
    players = [...players, data];
    console.log('uzers', players);
    io.emit('updateStores', players);
    console.log(connectionsCounter);
  });

  socket.on('disconnect', () => {
    connectionsCounter === 0 ? (connectionsCounter = 0) : connectionsCounter--;
    console.log('ysysysysysys', players);
    let takenOutUser = players.filter((x) => {
      console.log('filter', x);
      console.log(x.id);
      console.log(socket.id);
      console.log(socket.id === x.id);
      return x.id != socket.id;
    });
    players = takenOutUser;
    console.log('newnenwew', takenOutUser);
    io.emit('updateStores', takenOutUser);
    console.log(connectionsCounter);
    // delete players[socket.id];
  });

  socket.on('roundOver', (word) => {
    io.emit('roundOver', word);
  });

  socket.on('drawer', () => {
    console.log('random user requested');
    console.log('randomuserreq', players);
    io.emit('drawer', players[Math.floor(Math.random() * players.length)]);
  });

  socket.on('getUsers', () => {
    let user = Object.entries(players);
    console.log(user);
    io.emit('joined players', user);
  });

  socket.on('finishedPosition', () => {
    io.emit('finishedPosition');
  });

  socket.on('startPosition', () => {
    io.emit('startPosition');
  });
  socket.on('timer', (timer) => {
    io.emit('timer', timer);
  });
  socket.on('points', ({ data, pointCount, pointsAdded }) => {
    let pointAdd = players.find((player) => player.id === data);
    pointAdd.points = pointAdd.points + pointCount;
    io.emit('updateStores', players);
    io.emit('addPoints', { pointsAdded, data });
  });
});

io.listen(3000);
