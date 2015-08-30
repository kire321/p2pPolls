var Peer = require('peerjs')
var Promise = require('bluebird')
var _ = require('lodash')

var myId = _.random(0, 99)
console.log("myId", myId)

function handleNewConnection(conn, source) {
    conn.on('data', function(data) {
        console.log("got data")
        console.log(data)
    })
    conn.on('error', function(err) {
        console.log(err)
    })
    // var interval = setInterval(function() {
        console.log("sending", source, conn.dataChannel.readyState, conn.dataChannel.bufferedAmount)
        conn.send("hello")
    // }, 1000)
    conn.on('close', function() {
        clearInterval(interval)
    })
}

var peer = new Peer(myId, {key: 'qdpeahtrzay06bt9'})
peer.on('connection', function(conn) {
    console.log("got a connection")
    conn.on('open', function() {
        console.log("inbound connection is open")
        handleNewConnection(conn, "inbound")
    })
})

function connect(id) {
    return new Promise(function(resolve, reject) {
        var conn = peer.connect(id)
        conn.on('error', function(err) {
            reject(err)
        })
        conn.on('open', function() {
            console.log("connection succeeded", id)
            resolve(conn)
        })
    })
}

var connections = _.range(100).map(connect)
var firstPeerPromise = Promise.any(connections)
firstPeerPromise.then(function (firstPeer) {
    console.log("i have friends!!")
    handleNewConnection(firstPeer, "outbound")
})

document.body.textContent = "Hello World!"
