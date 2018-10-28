import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import { getBytes32FromMultihash } from '../util/multihash'
import {formatGroupInfo, formatGroupData, combineGroupDataAndInfo, formatNotes} from '../util/formatResponse'
import DialogForm from './forms/DialogForm'
import NoteForm from './forms/NoteForm'

import TopBar from './common/TopBar'
import IpfsContent from './common/IpfsContent'
import IpfsBlob from './common/IpfsBlob'

import GroupItem from './groups/GroupItem'


class Group extends Component {
  constructor (props, context) {
    super(props)
    this.contract = props.StudyGroup
    this.methods = context.drizzle.contracts.StudyGroup.methods
    this.id = window.location.pathname.split('/').pop()

    this.groupInfoKey = this.methods.getGroupInfo.cacheCall(this.id, this.id+1)
    this.groupDataKey = this.methods.getGroupData.cacheCall(this.id, this.id+1)
    this.groupMembersKey = this.methods.getGroupMembers.cacheCall(this.id)
    this.userGroupsKey = this.methods.getUserGroups.cacheCall(props.account)
    this.userNotesKey = this.methods.getUserNotes.cacheCall(props.account)

    this.state = {
      userNote: null,
      editingNote: false
    }
  }

  componentWillReceiveProps (nextProps) {
    let groups = this.props.StudyGroup.getUserGroups[this.userGroupsKey] ?
      this.props.StudyGroup.getUserGroups[this.userGroupsKey ].value : null

    let notes = this.props.StudyGroup.getUserNotes[this.userNotesKey] ?
      formatNotes(this.props.StudyGroup.getUserNotes[this.userNotesKey ].value) : null

    if (groups && notes && this.state.userNote === null && nextProps.hashedContent[notes[groups.indexOf(this.id)]]) {
      this.setState({...this.state, userNote:nextProps.hashedContent[notes[groups.indexOf(this.id)]]})
    }
  }

  fetchUserData = address => {

  }

  submitGroup = () => {
    const { fee, limit } = this.state.groupForm;
    const { digest, hashFunction, size } = getBytes32FromMultihash(this.props.requestedHash)
    const trx = this.methods.createGroup.cacheSend(digest, hashFunction, size, fee, limit)
    this.props.ipfsUploadAcked()
  }

  generateMetaDataHash = (notes) => {
    this.props.generateIPFSHash(JSON.stringify(notes))
  }

  submitEnroll = (value) => {
    const trx = this.methods.enroll.cacheSend(this.id, {value})
  }

  updateEditingNote = editingNote => this.setState({...this.state, editingNote})

  submitNote = (id, idx) => {
    this.props.saveNote(this.state.userNote, this.updateNote.bind(this, id, idx))
  }

  updateNote = (groupId, groupIdx, hash, hashFunction, size) => {
    console.log('updating note', groupId, groupIdx, hash, hashFunction, size)
    this.methods.updateNote.cacheSend(hash, hashFunction, size, groupId, groupIdx)
  }

  getRenderValues = () => {
    return {
      groupInfo: this.props.StudyGroup.getGroupInfo[this.groupInfoKey] ?
        formatGroupInfo(this.props.StudyGroup.getGroupInfo[this.groupInfoKey].value) : 'loading Groups',
      groupData: this.props.StudyGroup.getGroupData[this.groupDataKey] ?
        formatGroupData(this.props.StudyGroup.getGroupData[this.groupDataKey ].value) : 'loading Groups',
      groupMembers: this.props.StudyGroup.getGroupMembers[this.groupMembersKey] ?
        this.props.StudyGroup.getGroupMembers[this.groupMembersKey ].value : 'loading Groups',
      userGroups: this.props.StudyGroup.getUserGroups[this.userGroupsKey] ?
        this.props.StudyGroup.getUserGroups[this.userGroupsKey ].value : 'loading Groups',
      userNotes: this.props.StudyGroup.getUserNotes[this.userNotesKey] ?
        formatNotes(this.props.StudyGroup.getUserNotes[this.userNotesKey ].value) : 'loading Groups',
    }
  }

  updateUserNote = userNote => {
    console.log('un: ', userNote)
    this.setState({...this.state, userNote})
  }

  render () {
    const { groupInfo, groupData, groupMembers, userGroups, userNotes } = this.getRenderValues();
    const { account } = this.props;

    let group = 'Loading Group'

    if (Array.isArray(groupInfo) && Array.isArray(groupData)) {
      group = combineGroupDataAndInfo(groupInfo, groupData).map(g => <GroupItem key={g.name} {...g} />)
    }

    const userNote = Array.isArray(userGroups) && Array.isArray(userNotes) ?
      <IpfsBlob hash={userNotes[userGroups.indexOf(this.id)]}  /> : <div>loading note</div>

    const enrollmentStatus = Array.isArray(groupMembers) && groupMembers.find(m => m === account) ?
      this.state.editingNote ?
        <div>
          <Button onClick={this.submitNote.bind(this, this.id, userGroups.indexOf(this.id))} color="primary">
            Save Note
          </Button>

          <NoteForm text={this.state.userNote} handleChange={this.updateUserNote} />
        </div>
        :
        <div>
          <Button onClick={this.updateEditingNote.bind(this, true)} color="primary">
            Edit Note
          </Button>
          {userNote}
        </div>
      :
      <Button onClick={this.submitEnroll.bind(this, 0)} color="primary">
        Enroll
      </Button>;

    return (
      <div>
        <TopBar address={account} />
        <h3>Group</h3>
        {group}
        <div style={{width: '400px'}}>
          {enrollmentStatus}
        </div>
        <h4>Members</h4>
        {Array.isArray(groupMembers) ? groupMembers.map(m => <div>{m}</div>) : 'Loading Members'}

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
    requestedHash: state.data.requestedHash,
    hashedContent: state.data.hashedContent
  }
}

const mapDispatch = (dispatch) => {
    return {
        saveNote: (upload, save) => dispatch({type: 'IPFS_UPLOAD_THEN_SAVE', payload: {upload, save}}),
        getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default drizzleConnect(Group, mapState, mapDispatch);
