import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { getMultihash } from '../../util/multihash'
import Tile from './TopicTile'
import Ipfs from '../common/Ipfs'

class Item extends Component {
  constructor (props, context) {
    super(props)
    this.topicKey = context.drizzle.contracts.Algernon.methods[props.method].cacheCall(props.id)
  }

  getRenderValues = () => {
    return {
      topicResponse: this.props.Algernon[this.props.method][this.topicKey] ?
        Object.values(this.props.Algernon[this.props.method][this.topicKey].value) : null
    }
  }

  render () {
    const { noLink, linkTo, id } = this.props
    const { topicResponse } = this.getRenderValues();
    let topic = 'Loading Topic'

    if (Array.isArray(topicResponse)) {
        const link = noLink ? null : linkTo
        topic =
          <Ipfs hash={getMultihash(topicResponse)} >
            <Tile link={link} id={id} />
          </Ipfs>

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
    Algernon: state.contracts.Algernon
  }
}

export default drizzleConnect(Item, mapState);
