import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import { getBytes32FromMultihash } from '../util/multihash'
import {formatGroupInfo, formatGroupData, combineGroupDataAndInfo} from '../util/formatResponse'
import GroupForm from './forms/GroupForm'
import MultiMetaForm from './forms/MultiMetaForm'

import TopBar from './common/TopBar'
import IpfsContent from './common/IpfsContent'
import Text from './forms/common/Text'
import GroupItem from './groups/GroupItem'
import { FIELD_OPTIONS, GROUP_FIELDS, META_DATA_FIELDS } from './common/fields'


class User extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.StudyGroup.methods

    this.groupsInfoKey = this.methods.getGroupInfoUserGroups.cacheCall(props.account, 0, 10)
    this.groupsDataKey = this.methods.getGroupDataUserGroups.cacheCall(props.account, 0, 10)
    this.ownedGroupsInfoKey = this.methods.getGroupInfoUserOwnedGroups.cacheCall(props.account, 0, 10)
    this.ownedGroupsDataKey = this.methods.getGroupDataUserOwnedGroups.cacheCall(props.account, 0, 10)

    this.state = {
      openGroupFields: false,
      openMetaFields: false,
      groupForm: GROUP_FIELDS.reduce((acc, f) => {
        acc[f.label] = f.defaultValue;
        return acc;
      }, {}),
      groupMetaData: META_DATA_FIELDS.reduce((acc, f) => {
        acc[f.label] = f.defaultValue;
        return acc;
      }, {})
    }
  }

  updateDialogState = openGroupFields => this.setState({...this.state, openGroupFields})

  updateForm = (field, e) => this.setState({...this.state, groupForm: {...this.state.groupForm, [field]: e.target.value}})

  updateMetaData = (field, e) => {
    this.setState({...this.state, groupMetaData: {...this.state.groupMetaData, [field]: e.target.value}})
  }

  submitGroup = () => {
    const { digest, hashFunction, size } = getBytes32FromMultihash(this.props.requestedHash)
    this.methods.createGroup.cacheSend(
      digest,
      hashFunction,
      size,
      this.state.groupForm['Enrollment Fee'],
      this.state.groupForm['Enrollment Limit']
    )
    this.props.ipfsUploadAcked()
  }

  generateMetaDataHash = () => {
    this.props.generateIPFSHash(JSON.stringify(this.state.groupMetaData))
  }

  updateMetaField = () => false

  getRenderValues = () => {
    const { StudyGroup } = this.props
    return {
      groupsInfo: StudyGroup.getGroupInfoUserGroups[this.groupsInfoKey] ?
        formatGroupInfo(StudyGroup.getGroupInfoUserGroups[this.groupsInfoKey].value) : 'loading Groups',
      groupsData: StudyGroup.getGroupDataUserGroups[this.groupsDataKey] ?
        formatGroupData(StudyGroup.getGroupDataUserGroups[this.groupsDataKey].value) : 'loading Groups',
      ownedGroupsInfo: StudyGroup.getGroupInfoUserOwnedGroups[this.ownedGroupsInfoKey] ?
        formatGroupInfo(StudyGroup.getGroupInfoUserOwnedGroups[this.ownedGroupsInfoKey].value) : 'loading Groups',
      ownedGroupsData: StudyGroup.getGroupDataUserOwnedGroups[this.ownedGroupsDataKey] ?
        formatGroupData(StudyGroup.getGroupDataUserOwnedGroups[this.ownedGroupsDataKey].value) : 'loading Groups',
    }
  }

  render () {
    const { groupsInfo, groupsData, ownedGroupsInfo, ownedGroupsData} = this.getRenderValues();
    const { account } = this.props;
    let groups, ownedGroups;


    const formFields = GROUP_FIELDS.map(f => {
      f.value = this.state.groupForm[f.name]
      f.onChange = this.updateForm.bind(this, f.label)
      f.key = f.label
      return f;
    })

    const metaDataFields = META_DATA_FIELDS.map(f => {
      f.value = this.state.groupMetaData[f.label]
      f.onChange = this.updateMetaData.bind(this, f.label)
      f.key = f.label
      return f;
    })

    if (Array.isArray(groupsInfo) && Array.isArray(groupsData) && groupsInfo.length) {
      groups = combineGroupDataAndInfo(groupsInfo, groupsData).map(g => <GroupItem key={g.name} {...g} />)
    } else {
      groups = 'No Groups'
    }

    if (Array.isArray(ownedGroupsInfo) && Array.isArray(ownedGroupsData) && ownedGroupsInfo.length) {
      ownedGroups = combineGroupDataAndInfo(ownedGroupsInfo, ownedGroupsData).map(g => <GroupItem key={g.name} {...g} />)
    } else {
      ownedGroups = 'No Owned Groups'
    }

    return (
      <div>
        <TopBar address={account} />
        <h3>User Groups</h3>
        <div>
          {groups}
        </div>
        <h3>Owned Groups</h3>
        <Button onClick={this.updateDialogState.bind(this, true)} color="primary">
          Create Group
        </Button>
        <div>
          {ownedGroups}
        </div>
        <GroupForm
          open={this.state.openGroupFields}
          text='Fill in the fields below to create your own study group'
          handleClose={this.updateDialogState.bind(this, false)}
          submitLabel={this.props.requestedHash ? 'Create Group' : 'Prepare Group'}
          onSubmit={this.props.requestedHash ? this.submitGroup : this.generateMetaDataHash}
          content={formFields.concat(metaDataFields).map(Text)} />
        <MultiMetaForm
          open={this.state.openMetaFields}
          text='Update the group fields you want to describe your group below'
          handleClose={this.updateDialogState.bind(this, false)}
          submitLabel={this.props.requestedHash ? 'Create Group' : 'Prepare Group'}
          onSubmit={this.props.requestedHash ? this.submitGroup : this.generateMetaDataHash}
          fields={metaDataFields}
          fieldOptions={FIELD_OPTIONS} />
      </div>
    )
  }
}

User.contextTypes = {
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

export default drizzleConnect(User, mapState, mapDispatch);
