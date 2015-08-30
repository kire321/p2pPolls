var Peer = require('peerjs')
var Promise = require('bluebird')
var _ = require('lodash')

var myId = _.random(0, 99)
console.log("myId", myId)

function handleNewConnection(conn) {
    conn.on('data', function(data) {
        console.log(data)
    })
    conn.on('error', function(err) {
        console.log(err)
    })
    setInterval(function() {
        console.log("sending...")
        conn.send("hello")
    }, 1000)
}

var peer = new Peer(myId, {key: 'qdpeahtrzay06bt9'})
peer.on('connection', function(conn) {
    console.log("got a connection")
    handleNewConnection(conn)
})

function connect(id) {
    return new Promise(function(resolve, reject) {
        var conn = peer.connect(id)
        conn.on('error', function() {
            resolve(null)
        })
        conn.on('open', function() {
            console.log("connection succeeded", id)
            resolve(conn)
        })
    })
}

var connections = _.range(100).map(connect)
var successfulConnections = Promise.filter(connections, function (conn) {
    conn !== null
})
var firstPeerPromise = Promise.any(successfulConnections)
firstPeerPromise.then(function (firstPeer) {
    console.log("i have friends!!")
    handleNewConnection(firstPeer)
})

document.body.textContent = "Hello World!"
