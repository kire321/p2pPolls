import {Grid, Row, Col, Button} from 'react-bootstrap'
var _ = require('lodash')
var React = require('react')
require('bootstrap/dist/css/bootstrap.css')
require('./custom.css')
import QuestionList from './QuestionList.jsx'
import NewQuestion from './NewQuestion.jsx'

export default React.createClass({
    getInitialState() {
        return {
            questions: {
                id1: {
                    answer: "yes",
                    isSelected: false,
                },
                id2: {
                    answer: null,
                    isSelected: true,
                },
                id3: {
                    answer: null,
                    isSelected: false,
                },
            },
            activity: null,
        }
    },
    deepSetState(newState) {
        this.setState(_.merge(this.state, newState))
    },
    newQuestionClickHandler() {
        this.deepSetState({activity: 'newQuestion'})
    },
    putNewQuestion(text) {
        var id = _.random(1000000000)
        this.props.putNewQuestion(id, text)
        this.deepSetState({
            activity: null,
            questions: {
                [id]: {
                    answer: null,
                    isSelected: false,
                },
            }
        })
    },
    componentWillReceiveProps(nextProps) {
        console.log('np', nextProps)
        var sharedKeys = _.union(_.keys(nextProps.shared.text), _.keys(nextProps.shared.lastUpdated))
        console.log('existing keys', _.without(sharedKeys, ..._.keys(this.state.questions)))
        var missingKeys = _(sharedKeys)
            .without(..._.keys(this.state.questions))
            .map((id) => [id, {
                answer: null,
                isSelected: false,
            }])
            .zipObject()
            .value()
        console.log('mk', missingKeys)
        this.deepSetState({
            questions: missingKeys
        })

    },
    render() {
        console.log('local', this.state, this.props)
        var questions = _.mapValues(this.state.questions, (value, key) => _.merge(value, {
            text: this.props.shared.text[key],
            lastUpdated: this.props.shared.lastUpdated[key],
        }))
        return <Grid>
            <Row>
                <QuestionList questions={questions} newQuestionClickHandler={this.newQuestionClickHandler}/>
                {this.state.activity === 'newQuestion' && <NewQuestion
                    putNewQuestion={this.putNewQuestion}
                /> }
                {this.state.activity !== 'newQuestion' && <Col sm={9}> Hello, world!</Col>}
            </Row>
        </Grid>
    }
})
