const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}

if (messageForm != null) {
  //const name = prompt('What is your name?')
  appendMessage('You joined')
  socket.emit('new-user', roomName, username, 1)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You ` + '<i class="fas fa-badge-check"></i>' + `: ${message}`) //im here
    socket.emit('send-chat-message', roomName, message, 1)
    messageInput.value = ''
  })
}

socket.on('room-created', room => {
  console.log("room created")
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}/mod`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) { //here so uhh we need to 1 sec
  const messageElement = document.createElement('div')
  messageElement.innerHTML = message
  messageContainer.append(messageElement)
}