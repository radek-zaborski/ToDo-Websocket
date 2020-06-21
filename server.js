const express = require ('express');
const socket = require('socket.io');

let tasks = [];

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
  });
  
  app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
  });

  const io = socket(server);

  io.on('connection', (socket) =>{
    socket.broadcast.emit('updateData', tasks)
  })