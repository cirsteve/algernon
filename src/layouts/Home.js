import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

import { getMultihash, getBytes32FromMultihash } from '../util/multihash'
import {formatGroupInfo, formatGroupData, combineGroupDataAndInfo} from '../util/formatResponse'

import TopBar from './common/TopBar'
import IpfsContent from './common/IpfsContent'
import GroupItem from './groups/GroupItem'

class Home extends Component {
  constructor (props, context) {
    super(props)
    this.contract = props.StudyGroup
    this.methods = context.drizzle.contracts.StudyGroup.methods


    this.groupsCountKey = this.methods.getGroupCount.cacheCall(),
    this.groupInfoKey = this.methods.getGroupInfo.cacheCall(0,5),
    this.groupDataKey = this.methods.getGroupData.cacheCall(0,5)


  }

  getRenderValues = () => {
    return {
      groupInfo: this.props.StudyGroup.getGroupInfo[this.groupInfoKey] ?
        formatGroupInfo(this.props.StudyGroup.getGroupInfo[this.groupInfoKey].value) : 'loading Groups',
      groupData: this.props.StudyGroup.getGroupData[this.groupDataKey] ?
        formatGroupData(this.props.StudyGroup.getGroupData[this.groupDataKey ].value) : 'loading Groups',
    }
  }

  render () {
    const { account } = this.props
    const { groupInfo, groupData} = this.getRenderValues();
    let groups = 'Loading Groups'

    if (Array.isArray(groupInfo) && Array.isArray(groupData) && groupInfo.length) {
      groups = combineGroupDataAndInfo(groupInfo, groupData).map(g => <GroupItem key={g.name} {...g} />)
    } else {
      groups = 'No Groups'
    }
    return (
      <div>
        <TopBar address={account} />
        <h3>Groups</h3>
        {groups}
      </div>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    account: state.accounts[0],
    StudyGroup: state.contracts.StudyGroup
  }
}

export default drizzleConnect(Home, mapStateToProps);
