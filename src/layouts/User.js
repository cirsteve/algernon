import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Tabs from './common/Tabs'
import GroupList from './groups/List'
import TopicSection from './topics/Section'

class User extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.address = props.match.params.address

    this.userGroupsKey = this.methods.getUserGroupIds.cacheCall(this.address)
    this.userOwnedGroupsKey = this.methods.getUserOwnedGroupIds.cacheCall(this.address)
    this.topicIdsKey = this.methods.getUserTopicIds.cacheCall(this.address)
    this.tagCountKey = this.methods.getTagCount.cacheCall()
  }

  componentDidMount () {
    const { getTagCount, getTag } = this.methods

    this.props.getTags(getTagCount, getTag)
  }

  getRenderValues = () => {
    const { Groups } = this.props
    return {
      groupIds: Groups.getUserGroupIds[this.userGroupsKey] ?
        Groups.getUserGroupIds[this.userGroupsKey].value : null,
      ownedIds: Groups.getUserOwnedGroupIds[this.userOwnedGroupsKey] ?
        Groups.getUserOwnedGroupIds[this.userOwnedGroupsKey].value : null,
      topicIds: Groups.getUserTopicIds[this.topicIdsKey] ?
        Groups.getUserTopicIds[this.topicIdsKey].value : null,
      tagCount: Groups.getTagCount[this.tagCountKey] ?
        parseInt(Groups.getTagCount[this.tagCountKey].value) : null
    }
  }

  render () {
    const { tags } = this.props
    const { groupIds, ownedIds, topicIds } = this.getRenderValues();

    const tabs = [
      {
        label: `Topics`,
        content: <TopicSection key='topic' address={this.address} topicIds={topicIds} tags={tags} />
      },
      {
        label: 'Enrolled Groups',
        content: <GroupList key='groups' ids={groupIds} />
      },
      {
        label: 'Owned Groups',
        content: <GroupList key='owned' ids={ownedIds} />
      }
    ]

    return (
      <div>
        <Tabs tabs={tabs} />
      </div>
    )
  }
}

User.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Groups: state.contracts.Groups,
    tags: state.tags.tags
  }
}

const mapDispatch = (dispatch) => {
    return {
        getTags: (getTagCount, getTag) => dispatch({type: 'GET_TAGS', payload: {getTagCount, getTag}}),
        generateIPFSHash: upload => dispatch({type: 'IPFS_UPLOAD_REQUESTED', payload: {upload}}),
        getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default drizzleConnect(withRouter(User), mapState, mapDispatch);
