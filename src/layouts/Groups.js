import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import {range} from 'lodash'
import GroupItem from './groups/Item'

class Algernon extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Algernon.methods
    this.groupCountKey = this.methods.getGroupCount.cacheCall()
  }

  updateTag = (e) => this.setState({...this.state, tag: e.target.value})

  getRenderValues = () => ({
    groupCountResponse: this.props.Algernon.getGroupCount[this.groupCountKey] ?
      Object.values(this.props.Algernon.getGroupCount[this.groupCountKey].value) : null
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
        <h1>Algernon</h1>

        {groups}
      </div>
    )
  }
}

Algernon.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Algernon: state.contracts.Algernon
  }
}

export default drizzleConnect(Algernon, mapState)
