import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import TopicList from './topics/List'

class Tag extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Algernon.methods
    this.idx = props.match.params.idx

    this.tagKey = this.methods.getTag.cacheCall(this.idx)

  }

  componentDidMount = () => this.props.getTagTopics(
    this.idx,
    this.methods.getTagAddresses,
    this.methods.getTagAddressTopicIds
  )

  getRenderValues = () => {
    return {
      tag: this.props.Algernon.getTag[this.tagKey] ?
        this.props.Algernon.getTag[this.tagKey].value : null
      }
  }

  render () {
    const { tagTopicIds } = this.props
    const { tag } = this.getRenderValues()
    const topicIds = tagTopicIds[this.idx]

    return (
      <div>
        <div>
        {tag ? <h1>{tag}</h1> : 'Loading'}
        </div>
        <h3>Tagged Topics</h3>
        {topicIds ? <TopicList ids={topicIds} /> : 'Loading'}
      </div>
    )
  }
}

Tag.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    Algernon: state.contracts.Algernon,
    tagTopicIds: state.tags.tagTopicIds
  }
}

const mapDispatch = (dispatch) => ({
  getTagTopics: (tagId, getAddresses, getTopicIds) => dispatch({
    type: 'GET_TAG_TOPICS',
    payload: {
      tagId,
      getAddresses,
      getTopicIds
    }
  })
})

export default drizzleConnect(withRouter(Tag), mapState, mapDispatch);
