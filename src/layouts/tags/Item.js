import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { getMultihash } from '../../util/multihash'
import IpfsContent from '../common/IpfsContent'

class Item extends Component {
  constructor (props, context) {
    super(props)
    console.log('tag item', props.idx)
    this.tagKey = context.drizzle.contracts.Groups.methods.getTag.cacheCall(props.idx)
  }

  getRenderValues = () => {
    return {
      tagResponse: this.props.Groups.getTag[this.tagKey] ?
        this.props.Groups.getTag[this.tagKey].value : null
    }
  }

  render () {
    const { tagResponse } = this.getRenderValues();
    let tag = 'Loading Tag'

    if (tagResponse) {
      tag = tagResponse
    }

    return (
      <div>
        {tag}
      </div>
    )
  }
}

Item.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    Groups: state.contracts.Groups
  }
}

export default drizzleConnect(Item, mapState);