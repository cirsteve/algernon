import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Detail from './topics/Detail'
import { getMultihash } from '../util/multihash'

class Topic extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.id = props.match.params.id
    this.topicKey = this.methods.getTopic.cacheCall(this.id)
    this.tagIdsKey = this.methods.getTopicTagIds.cacheCall(this.id)


  }

  getRenderValues = () => ({
    topicResponse: this.props.Groups.getTopic[this.topicKey] ?
      Object.values(this.props.Groups.getTopic[this.topicKey].value) : null,
    tagIdsResponse: this.props.Groups.getTopicTagIds[this.tagIdsKey] ?
      Object.values(this.props.Groups.getTopicTagIds[this.tagIdsKey].value) : null
  })

  render () {
    const {topicResponse, tagIdsResponse} = this.getRenderValues()
    let topic = 'loading'
    console.log('render topic: ', this.topicKey, topicResponse)

    if (topicResponse) {
      const hash = getMultihash(topicResponse)
      console.log('render topic: ', this.topicKey, topicResponse, hash)
      topic = <Detail hash={hash} owner={topicResponse[4]} id={topicResponse[3]} />
    }

    return (
      <div>
        <h3>Topic</h3>
        {topic}
      </div>
    )
  }
}

Topic.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Groups: state.contracts.Groups
  }
}

export default drizzleConnect(withRouter(Topic), mapState)
