import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Enroll from './ui/Enroll'

class Group extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.id = props.match.params.id

    this.groupKey = this.methods.getGroup.cacheCall(this.id)
    this.membersKey = this.methods.getGroupMembers.cacheCall(this.id)
  }

  getRenderValues = () => {
    return {
      groupResponse: this.props.Groups.getGroupInfo[this.groupInfoKey] ?
        Object.values(this.props.Groups.getGroupInfo[this.groupInfoKey].value) : null,
      membersResponse: this.props.Groups.getGroupData[this.groupDataKey] ?
        this.props.Groups.getGroupData[this.groupDataKey ].value : null
      }
  }

  updateUserNote = userNote => {
    console.log('un: ', userNote)
    this.setState({...this.state, userNote})
  }

  render () {
    const { groupResponse, membersResponse } = this.getRenderValues()

    let group = 'Loading Group'
    let members = 'loading members'
    if (Array.isArray(groupResponse)) {
      group =
        <div>
          <Enroll id={this.id} value={groupResponse[1]} />
        </div>
    }

    if (Array.isArray(membersResponse)) {
      members =
        <div>
          {membersResponse.map(addr => addr)}
        </div>
    }

    return (
      <div>
        <h3>Group</h3>
        {group}
        {members}
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
    Groups: state.contracts.Groups,
  }
}

const mapDispatch = (dispatch) => {
    return {
        saveNote: (upload, save) => dispatch({type: 'IPFS_UPLOAD_THEN_SAVE', payload: {upload, save}}),
        getIPFSUpload: hash => dispatch({type: 'GET_IPFS_UPLOAD', payload: {hash}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})

    };
}

export default drizzleConnect(withRouter(Group), mapState, mapDispatch);
