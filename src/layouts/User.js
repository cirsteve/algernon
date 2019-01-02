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
    const address = props.match.params.address

    this.userGroupsKey = this.methods.getUserGroups.cacheCall(address)
    this.userOwnedGroupsKey = this.methods.getUserOwnedGroupIds.cacheCall(address)
    this.topicIdsKey = this.methods.getUserTopicIds.cacheCall(address)
    this.tagCountKey = this.methods.getTagCount.cacheCall()
    this.privateTopicIdsKey = ''
    if (props.connectedAddress === address) {
      this.privateTopicIdsKey = this.methods.getUserPrivateTopicIds.cacheCall()
    }
  }

  componentDidMount () {
    console.log('user did mount')
    const { getTagCount, getTag } = this.methods

    this.props.getTags(getTagCount, getTag)
  }

  getRenderValues = () => {
    const { Groups } = this.props
    return {
      groups: Groups.getUserGroups[this.userGroupsKey] ?
        Groups.getUserGroups[this.userGroupsKey].value : [[]],
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
    const { tags, connectedAddress } = this.props
    const { groups, ownedIds, topicIds, privateTopicIds } = this.getRenderValues();
    const address = this.props.match.params.address
    const isOwner = connectedAddress == address

    const tabs = [
      {
        label: `Topics`,
        content: <TopicSection key='topic' address={address} isOwner={isOwner} topicIds={topicIds} tags={tags} />
      },
      {
        label: 'Enrolled Groups',
        content: <GroupList key='groups' ids={groups[0]} isOwner={isOwner} />
      },
      {
        label: 'Owned Groups',
        content: <GroupSection key='owned' groupIds={ownedIds} tags={tags} isOwner={isOwner} />
      }
    ]

    if (privateTopicIds) {
      const privateTopics = {
        label: `Private Topics`,
        content: <TopicSection key='privateTopic' address={address} topicIds={privateTopicIds} tags={tags}  privateTopics={true} isOwner={isOwner} />
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
    trxs: state.transactions,
    tags: Object.keys(state.tags.tags)
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
