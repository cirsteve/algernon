import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

class Add extends Component {

  submit = () => this.context.drizzle.contracts.Groups.methods.addMasterTag.cacheSend(this.props.tag)

  render () {
    return (
      <Button onClick={this.submit} color="primary">
        Add Tag to List
      </Button>
    )
  }
}

Enroll.contextTypes = {
  drizzle: PropTypes.object
}

export default drizzleConnect(Add);
