import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import { getBytes32FromMultihash } from '../util/multihash'
import {formatGroupInfo, formatGroupData, combineGroupDataAndInfo} from '../util/formatResponse'
import DialogForm from './forms/DialogForm'

import TopBar from './common/TopBar'
import IpfsContent from './common/IpfsContent'
import GroupItem from './groups/GroupItem'

class Group extends Component {
  constructor (props, context) {
    super(props)
    this.contract = props.StudyGroup
    this.methods = context.drizzle.contracts.StudyGroup.methods
    console.log('con group: ', window.location.pathname.split('/').pop())
    this.id = window.location.pathname.split('/').pop()

    this.groupInfoKey = this.methods.getGroupInfo.cacheCall(this.id, this.id+1)
    this.groupDataKey = this.methods.getGroupData.cacheCall(this.id, this.id+1)
    this.groupMembersKey = this.methods.getGroupMembers.cacheCall(this.id)


  }

  submitGroup = () => {
    const { fee, limit } = this.state.groupForm;
    const { digest, hashFunction, size } = getBytes32FromMultihash(this.props.requestedHash)
    const trx = this.methods.createGroup.cacheSend(digest, hashFunction, size, fee, limit)
    this.props.ipfsUploadAcked()
    console.log('create grp trx: ', trx, digest, hashFunction, size, fee, limit, this.props.requestedHash)
  }

  generateMetaDataHash = (notes) => {
    this.props.generateIPFSHash(JSON.stringify(notes))
  }

  submitEnroll = (value) => {
    const trx = this.methods.createGroup.cacheSend(this.id, {value})
  }

  getRenderValues = () => {
    return {
      groupInfo: this.props.StudyGroup.getGroupInfo[this.groupInfoKey] ?
        formatGroupInfo(this.props.StudyGroup.getGroupInfo[this.groupInfoKey].value) : 'loading Groups',
      groupData: this.props.StudyGroup.getGroupData[this.groupDataKey] ?
        formatGroupData(this.props.StudyGroup.getGroupData[this.groupDataKey ].value) : 'loading Groups',
      groupMembers: this.props.StudyGroup.getGroupMembers[this.groupMembersKey] ?
        this.props.StudyGroup.getGroupMembers[this.groupMembersKey ].value : 'loading Groups',
    }
  }

  render () {
    const { groupInfo, groupData, groupMembers} = this.getRenderValues();
    const { account } = this.props;
    console.log('render group, ', groupInfo, groupData)

    const group = combineGroupDataAndInfo(groupInfo, groupData).map(g => <GroupItem key={g.name} {...g} />)

    return (
      <div>
        <TopBar address={account} />
        <h3>Group</h3>
        {group}
        <Button onClick={this.submitEnroll.bind(this, 0)} color="primary">
          Enroll
        </Button>
        <h4>Members</h4>
        {groupMembers.map(m => <div>{m}</div>)}

      </div>
    )
  }
}

Group.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    account: state.accounts[0],
    StudyGroup: state.contracts.StudyGroup,
    pendingUpload: state.data.pendingUpload,
    requestedHash: state.data.requestedHash
  }
}

const mapDispatch = (dispatch) => {
    return {
        generateIPFSHash: upload => dispatch({type: 'IPFS_UPLOAD_REQUESTED', payload: {upload}}),
        getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default drizzleConnect(Group, mapState, mapDispatch);
