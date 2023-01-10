import { Server } from 'socket.io'

let io

export async function startSocket(apps) {
  io = new Server(apps, { cors: { origin: '*' } })
  io.on('connection', () => {
    console.log('A user connected')
  })

  io.on('disconnect', () => {
    console.log('A user disconnected')
  })
}

export async function sendMessageSocket(channel, message) {
  console.log(channel, message)
  io.sockets.emit(channel, message)
}
