import {Grid, Row, Col, Button, Input} from 'react-bootstrap'
var _ = require('lodash')
var React = require('react')
require('bootstrap/dist/css/bootstrap.css')
require('./custom.css')
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
                    answer: '',
                    isSelected: true,
                },
                id3: {
                    answer: '',
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
                    answer: '',
                    isSelected: false,
                },
            }
        })
    },
    componentWillReceiveProps(nextProps) {
        var sharedKeys = _.union(_.keys(nextProps.shared.text), _.keys(nextProps.shared.lastUpdated), _.keys(nextProps.shared.answers))
        var missingKeys = _(sharedKeys)
            .without(..._.keys(this.state.questions))
            .map((id) => [id, {
                answer: '',
                isSelected: false,
            }])
            .zipObject()
            .value()
        this.deepSetState({
            questions: missingKeys
        })

    },
    onAnswerFactory(ref) {
        return () => {
            var answer = this.refs[ref].getValue().trim()
            var selectedId = _.findKey(this.state.questions, 'isSelected')
            this.deepSetState({
                questions: {
                    [selectedId]: {
                        answer: answer
                    }
                }
            })
            this.props.putAnswer(selectedId, answer)
        }
    },
    onSelectFactory(id) {
        return () => this.deepSetState({
            questions: {
                [id]: {
                    isSelected: true
                },
                [_.findKey(this.state.questions, 'isSelected')]: {
                    isSelected: false
                }
            }
        })
    },
    render() {
        var questions = _.mapValues(this.state.questions, (value, key) => _.merge(value, {
            text: this.props.shared.text[key],
            lastUpdated: this.props.shared.lastUpdated[key],
            answers: this.props.shared.answers[key],
        }))
        var selected = _.find(questions, 'isSelected')
        var split = _(questions)
            .mapValues((value, key) => _.merge(value, {id: key}))
            .values()
            .groupBy((question) => question.answer === '')
            .mapValues((questions) => _.sortBy(questions, 'lastUpdated').reverse())
            .value()
        var answered = split[false] ? split[false] : []
        var sorted = split[true] ? split[true].concat(split[false]) : answered
        return <Grid>
            <Row>
                <Col sm={3}>
                    <Button bsStyle="primary" block onClick={this.newQuestionClickHandler}>New Question</Button>
                    {
                        sorted.map((question, index) => {
                            if (question.isSelected) {
                                return <Button key={index} bsStyle="info" block>{question.text}</Button>
                            } else {
                                return <Button key={index} block onClick={this.onSelectFactory(question.id)}>{question.text}</Button>
                            }
                        })
                    }
                </Col>
                {this.state.activity === 'newQuestion' && <NewQuestion
                    putNewQuestion={this.putNewQuestion}
                /> }
                {this.state.activity !== 'newQuestion' && <Col sm={9}>
                    <h3>Your answer: {selected.answer}</h3>
                    <Input type="text" ref="textInput" onBlur={this.onAnswerFactory("textInput")} label="Submit a custom answer"/>
                    <Input type="select" ref="selection" onBlur={this.onAnswerFactory("selection")} label="or reuse a previous one">
                        {selected.answers.map((answer, index) => (<option value={answer} key={index}>{answer}</option>))}
                    </Input>
                </Col>}
            </Row>
        </Grid>
    }
})
