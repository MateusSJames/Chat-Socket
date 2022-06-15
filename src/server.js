const websocket = require('ws');
const express = require('express');
const path = require('path');
const body = require('body-parser');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(body.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    socket.emit('previousMessages', messages);
    socket.on('sendMessage', data => {
        if(data.message == 'fechar' || data.message == 'Fechar') {
            socket.disconnect();
        }else {
            messages.push(data);
            socket.broadcast.emit('receivedMessage', data);
        }
    });
});

server.listen(3000, () => {
    console.log('Server started!!');
}); 