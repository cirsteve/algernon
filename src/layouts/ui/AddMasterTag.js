import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

class Add extends Component {

  submit = () => {
    this.props.clearInput()
    this.context.drizzle.contracts.Algernon.methods.addMasterTag.cacheSend(this.props.tag)
    this.props.tagSubmitted(this.props.tag)
  }

  render () {
    return (
      <Button onClick={this.submit} disabled={this.props.tag.length ? false : true} variant="contained" color="primary">
        Add Tag to List
      </Button>
    )
  }
}

Add.contextTypes = {
  drizzle: PropTypes.object
}

const mapDispatch = (dispatch) => {
    return {
        tagSubmitted: (tag) => dispatch({type: 'TAG_SUBMITTED', payload: {tag}})

    };
}

export default drizzleConnect(Add, () => ({}), mapDispatch);
