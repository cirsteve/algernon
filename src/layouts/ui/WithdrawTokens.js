import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

class Withdraw extends Component {

  submit = () => this.context.drizzle.contracts.Algernon.methods.withdrawTokens.cacheSend(this.props.value)

  render () {
    return (
      <Button variant="contained" onClick={this.submit} color="primary">
        Withdraw Tokens
      </Button>
    )
  }
}

Withdraw.contextTypes = {
  drizzle: PropTypes.object
}

export default drizzleConnect(Withdraw);
