import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Text from '../common/forms/Text'
import Button from '../common/forms/Button'

class Form extends Component {
  constructor (props, context) {
    super(props)

    this.state = {
      amount: 0,
      to: ''
    }
  }

  clearInput = () => this.setState({...this.state, amount: 0, to: ''})

  updateState = (field, e) => this.setState({...this.state, [field]: e.target.value})

  submit = () => {
    this.context.drizzle.contracts.AlgerToken.methods.mint.cacheSend(this.state.to, this.state.amount)
    this.clearInput()
  }

  render () {
    return (
      <div>
        <Text onChange={this.updateState.bind(this, 'amount')} value={this.state.amount} label="amount" type="number" />
        <Text onChange={this.updateState.bind(this, 'to')} value={this.state.to} label="to" />
        <Button onClick={this.submit} text="Mint Tokens" />
      </div>
    )
  }
}

Form.contextTypes = {
  drizzle: PropTypes.object
}


export default Form
