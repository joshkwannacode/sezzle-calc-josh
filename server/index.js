const express = require('express')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

io.on('connection', socket => {
  socket.on('result', (result) => {
    io.emit('result', result)
  })
})

http.listen(PORT, function() {
  console.log(`listening on port ${PORT}`)
})