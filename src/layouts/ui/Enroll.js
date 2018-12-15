import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

class Enroll extends Component {

  submit = () => this.context.drizzle.contracts.Regen.methods.enroll.cacheSend(this.props.id, {value: this.props.value})

  render () {
    return (
      <Button onClick={this.submit} color="primary">
        Enroll
      </Button>
    )
  }
}

Enroll.contextTypes = {
  drizzle: PropTypes.object
}

export default drizzleConnect(Enroll);
