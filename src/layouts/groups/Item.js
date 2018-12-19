import React, { Component, Fragment } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { getMultihash } from '../../util/multihash'
import IpfsContent from '../common/IpfsContent'

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
    const { groupResponse } = this.getRenderValues();
    const {id} = this.props
    let group = 'Loading Group'
    if (Array.isArray(groupResponse)) {
        const link = `/groups/${id}`
        group =
          <Fragment>

            <IpfsContent hash={getMultihash(groupResponse.slice(5))} link={link} />
            <div>
              Fee: {groupResponse[1]}
            </div>
            <div>
              Limit: {groupResponse[2]}
            </div>
            <div>
              Owner: {groupResponse[4]}
            </div>
          </Fragment>
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
