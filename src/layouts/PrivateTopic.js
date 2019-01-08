import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Detail from './topics/Detail'
import { getMultihash } from '../util/multihash'

class Topic extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Algernon.methods
    this.id = props.match.params.id
    this.topicKey = this.methods.getPrivateTopic.cacheCall(this.id)
    this.tagIdsKey = this.methods.getPrivateTopicTagIds.cacheCall(this.id)


  }

  componentDidMount () {
    const { getTagCount, getTag } = this.methods

    this.props.getTags(getTagCount, getTag)
  }

  getRenderValues = () => ({
    topicResponse: this.props.Algernon.getPrivateTopic[this.topicKey] ?
      Object.values(this.props.Algernon.getPrivateTopic[this.topicKey].value) : null,
    tagIds: this.props.Algernon.getPrivateTopicTagIds[this.tagIdsKey] ?
      Object.values(this.props.Algernon.getPrivateTopicTagIds[this.tagIdsKey].value).map(id => parseInt(id)) : []
  })

  render () {
    const {topicResponse, tagIds} = this.getRenderValues()
    let topic = 'loading'

    if (topicResponse) {
      const hash = getMultihash(topicResponse)
      topic = <Detail hash={hash} owner={topicResponse[4]} id={topicResponse[3]} tagIds={tagIds}/>
    }

    return (
      <div>
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
    Algernon: state.contracts.Algernon,
    tags: state.tags.tags
  }
}

const mapDispatch = (dispatch) => {
    return {
        getTags: (getTagCount, getTag) => dispatch({type: 'GET_TAGS', payload: {getTagCount, getTag}}),

    };
}

export default drizzleConnect(withRouter(Topic), mapState, mapDispatch)
