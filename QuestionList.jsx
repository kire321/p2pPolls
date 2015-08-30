import React from 'react/addons'
import {Grid, Row, Col, Button} from 'react-bootstrap'
var _ = require('lodash')

export default React.createClass({
    render() {
        var split = _(this.props.questions)
            .values()
            .groupBy((question) => question.answer === null)
            .mapValues((questions) => _.sortBy(questions, 'lastUpdated').reverse())
            .value()
        var sorted = split[true].concat(split[false])
        return <Col sm={3}>
            <Button bsStyle="primary" block onClick={this.props.newQuestionClickHandler}>New Question</Button>
            {
                sorted.map((question, index) => {
                    if (question.isSelected) {
                        return <Button key={index} bsStyle="info" block>{question.text}</Button>
                    } else {
                        return <Button key={index} block>{question.text}</Button>
                    }
                })
            }
            </Col>
    }
})
