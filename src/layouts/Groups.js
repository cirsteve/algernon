import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import {range} from 'lodash'
import GroupItem from './groups/Item'

class Groups extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.groupCountKey = this.methods.getGroupCount.cacheCall()
  }

  updateTag = (e) => this.setState({...this.state, tag: e.target.value})

  getRenderValues = () => ({
    groupCountResponse: this.props.Groups.getGroupCount[this.groupCountKey] ?
      Object.values(this.props.Groups.getGroupCount[this.groupCountKey].value) : null
  })

  render () {
    const {groupCountResponse} = this.getRenderValues()
    let groups = 'loading'

    if (Array.isArray(groupCountResponse)) {
      const count = parseInt(groupCountResponse[0])
      if (count) {
        groups = range(count).map(id => <GroupItem key={id} id={id} />)
      } else {
        groups = 'No tags'
      }
    }

    return (
      <div>
        <h1>Groups</h1>

        {groups}
      </div>
    )
  }
}

Groups.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Groups: state.contracts.Groups
  }
}

export default drizzleConnect(Groups, mapState)
