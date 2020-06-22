const express = require('express');
const app = express();
const socket = require('socket.io');

let tasks = [];


app.use((req, res) => {
    res.status(404).send('404 not found...');
})

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000');
    
})

const io = socket(server);

io.on('connection', (socket) => {
    
    socket.on('updateData', () => {
        socket.emit('updateData', tasks);
      
    });
    
    socket.on('addTask', (task) => {
        const newTask = task;
        tasks.push(newTask);
        socket.broadcast.emit('addTask', newTask);
        console.log(tasks)
    })
    socket.on('removeTask', (index) => {
        const isLocal = true;
        let newArray = [...tasks];
        newArray = newArray.filter(function( obj ) {
            return obj.id !== index;
          });

        tasks = newArray;
        socket.broadcast.emit('removeTask', {id: index, bool: isLocal});
        console.log(tasks)
    })
});