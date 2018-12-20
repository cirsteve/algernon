import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Tabs from './common/Tabs'
import GroupList from './groups/List'
import GroupSection from './groups/Section'
import TopicSection from './topics/Section'

class User extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.address = props.match.params.address

    this.userGroupsKey = this.methods.getUserGroups.cacheCall(this.address)
    this.userOwnedGroupsKey = this.methods.getUserOwnedGroupIds.cacheCall(this.address)
    this.topicIdsKey = this.methods.getUserTopicIds.cacheCall(this.address)
    this.tagCountKey = this.methods.getTagCount.cacheCall()
    this.privateTopicIdsKey = ''
    if (props.connectedAddress === this.address) {
      this.privateTopicIdsKey = this.methods.getUserPrivateTopicIds.cacheCall()
    }
  }

  componentDidMount () {
    const { getTagCount, getTag } = this.methods

    this.props.getTags(getTagCount, getTag)
  }

  getRenderValues = () => {
    const { Groups } = this.props
    return {
      groups: Groups.getUserGroups[this.userGroupsKey] ?
        Groups.getUserGroups[this.userGroupsKey].value : null,
      ownedIds: Groups.getUserOwnedGroupIds[this.userOwnedGroupsKey] ?
        Groups.getUserOwnedGroupIds[this.userOwnedGroupsKey].value : null,
      topicIds: Groups.getUserTopicIds[this.topicIdsKey] ?
        Groups.getUserTopicIds[this.topicIdsKey].value : null,
      privateTopicIds: Groups.getUserPrivateTopicIds[this.privateTopicIdsKey] ?
        Groups.getUserPrivateTopicIds[this.privateTopicIdsKey].value : null,
      tagCount: Groups.getTagCount[this.tagCountKey] ?
        parseInt(Groups.getTagCount[this.tagCountKey].value) : null
    }
  }

  render () {
    const { tags } = this.props
    const { groups, ownedIds, topicIds, privateTopicIds } = this.getRenderValues();

    const tabs = [
      {
        label: `Topics`,
        content: <TopicSection key='topic' address={this.address} topicIds={topicIds} tags={tags} />
      },
      {
        label: 'Enrolled Groups',
        content: <GroupList key='groups' groups={groups} />
      },
      {
        label: 'Owned Groups',
        content: <GroupSection key='owned' groupIds={ownedIds} tags={tags} />
      }
    ]

    if (privateTopicIds) {
      const privateTopics = {
        label: `Private Topics`,
        content: <TopicSection key='privateTopic' address={this.address} topicIds={privateTopicIds} tags={tags}  privateTopics={true} />
      }
      tabs.splice(1,0, privateTopics)
    }

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
    connectedAddress: state.accounts[0],
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
