import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { getMultihash, getBytes32FromMultihash } from '../util/multihash'
import {formatGroupInfo, formatGroupData} from '../util/formatResponse'


class User extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.StudyGroup.methods

    this.groupsInfoKey = this.methods.getGroupInfoUserGroups.cacheCall(props.account)
    this.groupsDataKey = this.methods.getGroupDataUserGroups.cacheCall(props.account)
    this.ownedGroupsInfoKey = this.methods.getGroupInfoUserOwnedGroups.cacheCall(props.account)
    this.ownedGroupsDataKey = this.methods.getGroupDataUserOwnedGroups.cacheCall(props.account)
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
    return (
      <div>
        <h3>User Groups</h3>
        <div>
          {Array.isArray(groupsInfo) ? groupsInfo.length ? groupsInfo.map(gi => gi) : 'No Groups' : groupsInfo}
        </div>
        <h3>Owned Groups</h3>
        <div>
          {Array.isArray(ownedGroupsInfo) ? ownedGroupsInfo.length ? ownedGroupsInfo.map(gi => gi) : 'No Groups' : ownedGroupsInfo}
        </div>
      </div>
    )
  }
}

User.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    StudyGroup: state.contracts.StudyGroup
  }
}

export default drizzleConnect(User, mapStateToProps);
