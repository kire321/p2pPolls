var Peer = require('peerjs')

var peer = new Peer(0, {key: 'qdpeahtrzay06bt9', debug: 3})
peer.on('error', function(err) {
    console.log(err)
})
var conn = peer.connect(1)
conn.on('error', function(err) {
    console.log(err)
})
conn.on('data', function(data) {
    console.log(data)
})
conn.on('open', function() {
    conn.send("hello")
})

document.body.textContent = "Hello World!"
