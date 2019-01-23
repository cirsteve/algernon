import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

class Add extends Component {

  submit = () => this.context.drizzle.contracts.Algernon.methods.withdrawTokens.cacheSend(
    this.props.topicId,
    this.props.tagId,
    this.props.amt
  )

  render () {
    return (
      <Button variant="contained" onClick={this.submit} color="primary">
        Add Stake
      </Button>
    )
  }
}

Add.contextTypes = {
  drizzle: PropTypes.object
}

export default drizzleConnect(Add);
