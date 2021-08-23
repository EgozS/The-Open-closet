const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const db = require('quick.db');

if (messageForm != null) {
  const name = prompt('What is your name? (leave black if annonymus)')
  appendMessage('You joined')
  appendMessage('A staff member will soonly join you, this might take a few minutes')
  appendMessage('To get more info please email us at: later@later.later')
  socket.emit('new-user', roomName, name)
  if (name == null || name == '' || name == undefined) {
    name = "Annonymous" 
  } else {
    name = name;
  }
  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}

socket.on('room-created', room => {
  console.log("room created")
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
    appendMessage(`${data.name}:` + '<i class="fas fa-badge-check"></i>' + ` ${data.message}`)
})

socket.on('user-connected', name => { 
    appendMessage(`${name}` + '<i class="fas fa-badge-check"></i>' + ` connected`)
})

socket.on('user-disconnected', name => {
    appendMessage(`${name}` + '<i class="fas fa-badge-check"></i>' + ` disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = message
  messageContainer.append(messageElement)
}
