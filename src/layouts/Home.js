import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { range } from 'lodash'

import GroupItem from './groups/Item'

class Home extends Component {
  constructor (props, context) {
    super(props)
    this.countKey = context.drizzle.contracts.Groups.methods.getGroupCount.cacheCall()
  }

  getRenderValues = () => {
    return {
      count: this.props.Groups.getGroupCount[this.countKey] ?
        parseInt(this.props.Groups.getGroupCount[this.countKey].value, 10) : null
    }
  }

  render () {
    const { count} = this.getRenderValues();
    let groups = 'Loading Groups'

    if (Number.isInteger(count)) {
      if (count) {
        groups = range(count).map(id => <GroupItem key={id} id={id} />)
      } else {
        groups = 'No Groups'
      }
    }
    return (
      <div>
        <h3>Groups</h3>
        {groups}
      </div>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    Groups: state.contracts.Groups
  }
}

export default drizzleConnect(Home, mapStateToProps);
