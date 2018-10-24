import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import { getBytes32FromMultihash } from '../util/multihash'
import {formatGroupInfo, formatGroupData, combineGroupDataAndInfo} from '../util/formatResponse'
import DialogForm from './forms/DialogForm'

import TopBar from './common/TopBar'
import IpfsContent from './common/IpfsContent'

const GroupItem = props =>
  <div>
    <div>
      owner: {props.owner}
    </div>
    <div>
      fee: {props.fee}
    </div>
    <div>
      limit: {props.limit}
    </div>
    <IpfsContent hash={props.hash} />
  </div>

const GROUP_FIELDS = [
  {
    name: 'fee',
    label: 'Enrollment Fee',
    type: 'number',
    defaultValue: 0,
  },
  {
    name: 'limit',
    label: 'Enrollment Limit',
    type: 'number',
    defaultValue: 0,
  }
]

const META_DATA_FIELDS = [
  {
    name: 'name',
    label: 'Name',
    type: 'string',
    defaultValue: ''
  },
  {
    name: 'description',
    label: 'Description',
    type: 'string',
    defaultValue: ''
  },
  {
    name: 'materials',
    label: 'Materials',
    type: 'string',
    defaultValue: ''
  },
]


class User extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.StudyGroup.methods
    console.log('us coin: ', props.account)
    this.groupsInfoKey = this.methods.getGroupInfoUserGroups.cacheCall(props.account)
    this.groupsDataKey = this.methods.getGroupDataUserGroups.cacheCall(props.account)
    this.ownedGroupsInfoKey = this.methods.getGroupInfoUserOwnedGroups.cacheCall(props.account)
    this.ownedGroupsDataKey = this.methods.getGroupDataUserOwnedGroups.cacheCall(props.account)

    this.state = {
      open: false,
      groupForm: GROUP_FIELDS.reduce((acc, f) => {
        acc[f.name] = f.defaultValue;
        return acc;
      }, {}),
      groupMetaData: META_DATA_FIELDS.reduce((acc, f) => {
        acc[f.name] = f.defaultValue;
        return acc;
      }, {})
    }
  }

  updateDialogState = open => this.setState({...this.state, open})

  updateForm = (field, e) => this.setState({...this.state, groupForm: {...this.state.groupForm, [field]: e.target.value}})

  updateMetaData = (field, e) => this.setState({...this.state, groupMetaData: {...this.state.groupMetaData, [field]: e.target.value}})

  submitGroup = () => {
    const { fee, limit } = this.state.groupForm;
    const { digest, hashFunction, size } = getBytes32FromMultihash(this.props.requestedHash)
    const trx = this.methods.createGroup.cacheSend(digest, hashFunction, size, fee, limit)
    this.props.ipfsUploadAcked()
    console.log('create grp trx: ', trx, digest, hashFunction, size, fee, limit, this.props.requestedHash)
  }

  generateMetaDataHash = () => {

    this.props.generateIPFSHash(JSON.stringify(this.state.groupMetaData))
  }

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
      f.value = this.state.groupForm[f.name];
      f.onChange = this.updateForm.bind(this, f.name)
      return f;
    })

    const metaDataFields = META_DATA_FIELDS.map(f => {
      f.value = this.state.groupMetaData[f.name];
      f.onChange = this.updateMetaData.bind(this, f.name)
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
        <DialogForm open={this.state.open}
          handleClose={this.updateDialogState.bind(this, false)}
          submitLabel={this.props.requestedHash ? 'Create Group' : 'Prepare Group'}
          onSubmit={this.props.requestedHash ? this.submitGroup : this.generateMetaDataHash}
          fields={formFields}
          metaDataFields={metaDataFields} />
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
