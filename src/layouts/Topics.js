import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import {range} from 'lodash'
import TopicItem from './topics/Item'

class Topics extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.topicCountKey = this.methods.getTopicCount.cacheCall()
  }

  updateTag = (e) => this.setState({...this.state, tag: e.target.value})

  getRenderValues = () => ({
    topicCountResponse: this.props.Groups.getTopicCount[this.topicCountKey] ?
      Object.values(this.props.Groups.getTopicCount[this.topicCountKey].value) : null
  })

  render () {
    const {topicCountResponse} = this.getRenderValues()
    let topics = 'loading'

    if (Array.isArray(topicCountResponse)) {
      const count = parseInt(topicCountResponse[0])
      if (count) {
        topics = range(count).map(id => <TopicItem key={id} id={id} method='getTopic'/>)
      } else {
        topics = 'No topics'
      }
    }

    return (
      <div>
        <h3>Topics</h3>

        {topics}
      </div>
    )
  }
}

Topics.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Groups: state.contracts.Groups
  }
}

export default drizzleConnect(Topics, mapState)
