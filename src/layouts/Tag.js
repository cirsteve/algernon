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
    this.topicIdsKey = this.methods.getTagTopicIds.cacheCall(this.idx)

  }

  getRenderValues = () => {
    return {
      tag: this.props.Algernon.getTag[this.tagKey] ?
        this.props.Algernon.getTag[this.tagKey].value : null,
      topicIds: this.props.Algernon.getTagTopicIds[this.topicIdsKey] ?
        Object.values(this.props.Algernon.getTagTopicIds[this.topicIdsKey].value) : null
      }
  }

  render () {
    const { tag, topicIds } = this.getRenderValues()

    console.log(tag, topicIds)
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
    address: state.accounts[0],
    Algernon: state.contracts.Algernon,
  }
}

const mapDispatch = (dispatch) => {
    return {
        saveNote: (upload, save) => dispatch({type: 'IPFS_UPLOAD_THEN_SAVE', payload: {upload, save}}),
        getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default drizzleConnect(withRouter(Tag), mapState, mapDispatch);
