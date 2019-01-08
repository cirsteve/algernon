import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'

class Item extends Component {
  constructor (props, context) {
    super(props)
    console.log('tag item', props.id)
    this.tagKey = context.drizzle.contracts.Algernon.methods.getTag.cacheCall(props.id)
  }

  getRenderValues = () => {
    return {
      tagResponse: this.props.Algernon.getTag[this.tagKey] ?
        this.props.Algernon.getTag[this.tagKey].value : null
    }
  }

  render () {
    const {id} = this.props
    const { tagResponse } = this.getRenderValues();
    let tag = 'Loading Tag'

    if (tagResponse) {
      tag = tagResponse
    }

    return (
        <MenuItem value={id}>{tag}</MenuItem>
    )
  }
}

Item.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    Algernon: state.contracts.Algernon
  }
}

export default drizzleConnect(Item, mapState);
