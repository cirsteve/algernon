import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'

import PropTypes from 'prop-types'
import { getMultihash, getBytes32FromMultihash } from '../util/multihash'
import {formatGroupInfo, formatGroupData} from '../util/formatResponse'

class Home extends Component {
  constructor (props, context) {
    super(props)
    this.contract = props.StudyGroup
    this.methods = context.drizzle.contracts.StudyGroup.methods


    this.groupsCountKey = this.methods.getGroupCount.cacheCall(),
    this.groupInfoKey = this.methods.getGroupInfo.cacheCall(),
    this.groupDataKey = this.methods.getGroupData.cacheCall()


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
    const { groupInfo, groupData} = this.getRenderValues();
    return (
      <div>
        <h3>Groups</h3>
        {Array.isArray(groupInfo) ? groupInfo.length ? groupInfo.map(gi => gi) : 'No Groups' : groupInfo}
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
    accounts: state.accounts,
    StudyGroup: state.contracts.StudyGroup
  }
}

export default drizzleConnect(Home, mapStateToProps);
