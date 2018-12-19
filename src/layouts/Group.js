import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { getMultihash } from '../util/multihash'
import IpfsContent from './common/IpfsContent'
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
      groupResponse: this.props.Groups.getGroup[this.groupKey] ?
        Object.values(this.props.Groups.getGroup[this.groupKey].value) : null,
      membersResponse: this.props.Groups.getGroupMembers[this.membersKey] ?
        this.props.Groups.getGroupMembers[this.membersKey].value : null
      }
  }

  render () {
    const { address} = this.props
    const { groupResponse, membersResponse } = this.getRenderValues()

    let group = 'Loading Group'
    let members = 'loading members'
    let enroll = null
    if (Array.isArray(groupResponse)) {
      group =
        <div>
          <IpfsContent hash={getMultihash(groupResponse.slice(5))} />
          <div>
            Fee: {groupResponse[1]}
          </div>
          <div>
            Limit: {groupResponse[2]}
          </div>
          <div>
            Owner: <Link to={`/users/${groupResponse[4]}`}>{groupResponse[4]}</Link>
          </div>
        </div>
    }

    if (Array.isArray(membersResponse)) {
      members =
        <div>
          {membersResponse.map(addr => <Link to={`/users/${addr}`}>{addr}</Link>)}
        </div>
    }

    if (Array.isArray(membersResponse)) {
      enroll = Array.isArray(groupResponse) && membersResponse.find(m => m === address) ? 'Enrolled' : <Enroll id={this.id} value={groupResponse[1]} />
    }

    return (
      <div>
        <h3>Group</h3>
        {enroll}
        {group}
        <h3>Members</h3>
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
    address: state.accounts[0],
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
