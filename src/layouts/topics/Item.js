import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { getMultihash } from '../../util/multihash'
import IpfsBlob from '../common/IpfsBlob'

class Item extends Component {
  constructor (props, context) {
    super(props)
    this.topicKey = context.drizzle.contracts.Groups.methods.getTopic.cacheCall(props.address, props.idx)
  }

  getRenderValues = () => {
    return {
      topicResponse: this.props.Groups.getTopic[this.topicKey] ?
        Object.values(this.props.Groups.getTopic[this.topicKey].value) : null
    }
  }

  render () {
    const { topicResponse } = this.getRenderValues();
    let topic = 'Loading Topic'

    if (Array.isArray(topicResponse)) {
        topic = <IpfsBlob hash={getMultihash(topicResponse)} />
    }

    return (
      <div>
        {topic}
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
    Groups: state.contracts.Group
  }
}

export default drizzleConnect(Item, mapState);
