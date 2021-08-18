const express = require('express') //hello
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const localtunnel = require('localtunnel');
const db = require('quick.db');
var usrname;
var port = 3000;

//fxed LMAO WE HAD 2 SESSIONS
(async () => {
  const tunnel = await localtunnel({ port: port, subdomain: "theopencloset"});

  // the assigned public url for your tunnel dm me when ur back
  // i.e. https://abcdefgjhij.localtunnel.me
  console.log(tunnel.url);
  console.log("http://localhost:3000");

})();




app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms }) 
})

app.get('/login', (req, res) => {
  res.render('login') 
})

app.post('/chklogin', (req, res) => {
  console.log(db.get('logins')['username'].includes(req.body.username));
  usrname = req.body.username;
  if (db.get('logins')['username'].includes(req.body.username)) {
    if (db.get('logins')['password'].includes(req.body.password)) {
      res.render('index-mod', { rooms: rooms })
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }
})
app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
  io.emit('full', '1', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/') 
  }
  //app.locals.roomName = req.params.room 
  res.render('room', { roomName: req.params.room }) //petition t
})

app.get('/:room/mod', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/') 
  }
  //app.locals.roomName = req.params.room 
  res.render('room-mod', { roomName: req.params.room, username: usrname }) //petition t
})

server.listen(port)

io.on('connection', socket => {
  socket.on('new-user', (room, name, verified) => {
    socket.join(room) 
    rooms[room].users[socket.id] = name
    if (verified == 1) {
      socket.to(room).emit('user-connected', name, 1)//works c
    }
    else {
      socket.to(room).emit('user-connected', name)
    }
  })
  socket.on('send-chat-message', (room, message, verified) => {
    if (verified == 1) {
      socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id], verified: 1 })
    } else {
      socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
    }
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]) //i added the ok
      delete rooms[room].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}
