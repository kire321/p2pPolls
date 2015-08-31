import Local from './Local.jsx'
var React = require('react')
const Bacon = require('baconjs')
var deepEqual = require('deep-equal')

export const peerStates = new Bacon.Bus()

export const Shared = React.createClass({
    deepSetState(newState) {
        console.log(this.state, newState)
        if (!deepEqual(this.state, newState)) {
            var combined = _.merge(this.state, newState)
            this.props.getConnections().forEach((conn) => {
                console.log("sending")
                conn.send(combined)
            })
            this.setState(combined)
        }
    },
    componentWillMount() {
        peerStates.onValue(this.deepSetState)
    },
    getInitialState() {
        return {
            text: {
                id1: "Do you like wizardry?",
                id2: "What is your favorite color?",
                id3: "How's the weather?",
            },
            lastUpdated: {
                id1: 2,
                id2: 1,
                id3: 10,
            }
        }
    },
    putNewQuestion(id, text) {
        this.deepSetState({
            text: {
                [id]: text
            },
            lastUpdated: {
                [id]: Date.now(),
            }
        })
    },
    render() {
        return <Local
            shared={this.state}
            putNewQuestion={this.putNewQuestion}
        />
    }
})
