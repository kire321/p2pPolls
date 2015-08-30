import React from 'react/addons'
import {Input, ButtonInput, Col} from 'react-bootstrap'

export default React.createClass({
    newQuestionSubmittedHandler(event) {
        event.preventDefault()
        this.props.putNewQuestion(this.refs.input.getValue().trim())
    },
    render() {
        return <form onSubmit={this.newQuestionSubmittedHandler}>
            <Col sm={6}>
                <Input type="text" ref="input" />
            </Col>
            <Col sm={3}>
                <ButtonInput type="submit" value="Create Question" />
            </Col>
        </form>
    }
})
