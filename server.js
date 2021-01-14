'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  /**
   * Create function to send status
   * @param success {bool}
   * @param message {string}
   */
  const sendStatus = function(){
    console.log('emitting');
    socket.emit('status');
  }

  socket.on('transmit', () => {
    io.emit('chatupdated');
  });

  socket.on('usertyping', (data) => {
    io.emit('istyping', data);
  });

  socket.on('userEnteredChat', () => {
    io.emit('refreshChatUsers');
  });

  socket.on('userLeftChat', () => {
    io.emit('refreshChatUsers');
  });

  socket.on('usernottyping', (data) => {
    io.emit('nottyping', data);
  });

  socket.on('input', (data) => {
      const input = data;
      console.log(input);
      sendStatus({
        success: true,
        message: 'Recieved the input ' + input
      });
    })

  socket.on('disconnect', () => console.log('Client disconnected'));

});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
