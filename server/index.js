import express from 'express';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { PORT, FRONTEND_SERVER } from './config.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: FRONTEND_SERVER
    }
});

app.use(cors());
app.use(morgan('dev'));

io.on('connection', (socket) => {
    console.log(socket.id, 'connected');

    socket.on('message', (message) => {
        socket.broadcast.emit('message', {
            body: message,
            from: socket.id
        });
    })
});

server.listen(PORT);
console.log(`Server running on port ${ PORT }`)