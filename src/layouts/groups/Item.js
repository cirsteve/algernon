import React, { Component, Fragment } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { getMultihash } from '../../util/multihash'
import Tile from './GroupTile'
import Ipfs from '../common/Ipfs'

class Item extends Component {
  constructor (props, context) {
    super(props)
    this.groupKey = context.drizzle.contracts.Groups.methods.getGroup.cacheCall(props.id)
  }

  getRenderValues = () => {
    return {
      groupResponse: this.props.Groups.getGroup[this.groupKey] ?
        Object.values(this.props.Groups.getGroup[this.groupKey].value) : null
    }
  }

  render () {
    const { noLink, linkTo, id } = this.props
    const { groupResponse } = this.getRenderValues();

    let group = 'Loading Group'
    if (Array.isArray(groupResponse)) {
      const link = noLink ? null : linkTo
      group =
        <Ipfs hash={getMultihash(groupResponse.slice(5))} >
          <Tile link={link} id={id} />
        </Ipfs>
    }

    return (
      <div>
        {group}
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
