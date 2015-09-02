var Peer = require('peerjs')
var Promise = require('bluebird')
var _ = require('lodash')
var React = require('react')
import {Shared, peerStates} from './Shared.jsx'

var possibleIdCount = 10
var myId = _.random(0, possibleIdCount - 1)
console.log("myId", myId)
var connections = []
function getConnections() {
    return _.uniq(connections, (conn) => "" + conn.peer)
}

var firstConnectionPromiseResolve
var firstConnectionPromise = new Promise((resolve, reject) => firstConnectionPromiseResolve = resolve)
var shared = <Shared getConnections={getConnections}/>
// firstConnectionPromise.then(() => React.render(shared, document.body))
React.render(shared, document.body)

function handleNewConnection(conn, source) {
    conn.on('data', function(data) {
        console.log("got data")
        peerStates.push(data)
    })
    conn.on('error', function(err) {
        console.log(err)
    })
    conn.on('close', function() {
        console.log("conn closed")
    })
    console.log("new connection", conn)
    connections.push(conn)
    firstConnectionPromiseResolve()
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
        var conn = peer.connect(id, {serialization: 'json'})
        conn.on('error', function(err) {
            reject(err)
        })
        conn.on('open', function() {
            console.log("connection succeeded", id)
            resolve(conn)
        })
    })
}

var candidates = _.range(possibleIdCount).map(connect)
var firstOutboundPromise = Promise.any(candidates)
firstOutboundPromise.then(function (firstPeer) {
    console.log("i have friends!!")
    handleNewConnection(firstPeer, "outbound")
})
