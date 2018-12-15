import React, { Component, Fragment } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'


class Item extends Component {
  constructor (props, context) {
    super(props)
    this.groupKey = context.drizzle.contracts.Regen.methods.getGroup.cacheCall(props.id)
  }

  getRenderValues = () => {
    return {
      groupResponse: this.props.Groups.getGroup[this.groupKey] ?
        this.props.Groups.getGroup[this.groupKey].value : null
    }
  }

  render () {
    const { groupResponse } = this.getRenderValues();
    let group = 'Loading Group'

    if (Array.isArray(groupResponse)) {
        group =
          <Fragment>
            <div>
              Fee: {groupResponse[1]}
            </div>
            <div>
              Limit: {groupResponse[2]}
            </div>
            <div>
              Limit: {groupResponse[4]}
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
    Groups: state.contracts.Group
  }
}

export default drizzleConnect(Item, mapState);
