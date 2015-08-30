var Peer = require('peerjs')
var Promise = require('bluebird')
var _ = require('lodash')
var React = require('react')
import {Grid, Row, Col, Button} from 'react-bootstrap'
require('bootstrap/dist/css/bootstrap.css')
require('./custom.css')
import QuestionList from './QuestionList.jsx'
import NewQuestion from './NewQuestion.jsx'

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
        console.log("conn closed")
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

var Index = React.createClass({
    getInitialState() {
        return {
            'questions': {
                'id1': {
                    text: "Do you like wizardry?",
                    answer: "yes",
                    lastUpdated: 2,
                    isSelected: false,
                },
                'id2': {
                    text: "What is your favorite color?",
                    answer: null,
                    lastUpdated: 1,
                    isSelected: true,
                },
                'id3': {
                    text: "How's the weather?",
                    answer: null,
                    lastUpdated: 10,
                    isSelected: false,
                },
            },
            'activity': null,
        }
    },
    deepSetState(newState) {
        this.setState(_.merge(this.state, newState))
    },
    newQuestionClickHandler() {
        this.deepSetState({activity: 'newQuestion'})
    },
    putNewQuestion(text) {
        this.deepSetState({
            activity: null,
            questions: {
                [_.random(1000000000)]: {
                    text: text,
                    answer: null,
                    lastUpdated: Date.now(),
                    isSelected: false,
                },
            }
        })
        console.log(this.state)
    },
    render() {
        return <Grid>
            <Row>
                <QuestionList questions={this.state.questions} newQuestionClickHandler={this.newQuestionClickHandler}/>
                {this.state.activity === 'newQuestion' && <NewQuestion
                    putNewQuestion={this.putNewQuestion}
                /> }
                {this.state.activity !== 'newQuestion' && <Col sm={9}> Hello, world!</Col>}
            </Row>
        </Grid>
    }
})

React.render(<Index />, document.body)
