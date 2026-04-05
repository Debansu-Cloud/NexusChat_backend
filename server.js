import { createServer } from 'node:http';
import express from 'express';
import { Server } from "socket.io";
import { Socket } from 'node:dgram';


const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: '*',
    }
});

const ROOM = 'group';

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);


  socket.on('joinRoom',async (userName) => {
    console.log(`${userName} is joined the group...`);
  await  socket.join(ROOM);

  //send to all
  // io.to(ROOM).emit('roomNotice', userName);

  //broadcast to all except sender\
  socket.to(ROOM).emit('roomNotice', userName);


  });


  
     socket.on('chatMessage', function (msg) {
        socket.to(ROOM).emit('chatMessage', msg);
    });

    socket.on('typing',(userName) =>{
        socket.to(ROOM).emit('typing', userName);
    })
    
    
     socket.on('stopTyping',(userName) =>{
        socket.to(ROOM).emit('stopTyping', userName);
    });


});


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(4600, () => {
  console.log('server running at http://localhost:4600');
});