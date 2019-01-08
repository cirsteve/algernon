import React, { Component, Fragment } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import Dialog from '../common/Dialog'
import Fab from '@material-ui/core/Fab';
import DoneIcon from '@material-ui/icons/Done';

class Create extends Component {
  constructor (props, context) {
    super(props)

    this.state = {
      openInfo: false,
      hashId: null
    }
  }

  updateShowingInfo = openInfo => this.setState({...this.state, openInfo})

  submit = () => {
    const hashId = Math.ceil(Math.random() * 1000000000000);
    let submit = this.context.drizzle.contracts.Algernon
      .methods[this.props.contractSubmit].cacheSend;
    if (this.props.submitArgs) this.props.submitArgs.forEach(arg => submit = submit.bind(this, arg))
    this.props.contractFields.forEach(field => submit = submit.bind(this, field))
    this.props.submit(JSON.stringify(this.props.offChainFields), submit, hashId)
    this.setState({...this.state, hashId, openInfo: true})
    this.props.onSubmit && this.props.onSubmit()
  }

  render () {

    const dialogContent = this.state.hashId && this.props.uploadedHashes[this.state.hashId] ?
      'Complete Your Submission wtih MetaMask'
      :
      'Preparing Your Transaction'



    return (
      <Fragment>
      {this.props.useIcon ?
        <Fab onClick={this.submit} color="secondary" aria-label="Edit" >
          <DoneIcon />
        </Fab>
        :
        <Button onClick={this.submit} color="primary">
          {this.props.buttonText}
        </Button>
      }
        <Dialog
          dialogTitle=''
          open={this.state.openInfo}
          handleClose={this.updateShowingInfo.bind(this, false)}
          content={dialogContent} />
      </Fragment>
    )
  }
}

Create.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    Algernon: state.contracts.Algernon,
    pendingUpload: state.data.pendingUpload,
    uploadedHashes: state.data.uploadedHashes
  }
}

const mapDispatch = (dispatch) => {
    return {
        submit: (upload, save, hashId) => dispatch({type: 'IPFS_UPLOAD_THEN_SAVE', payload: {upload, save, hashId}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})
    };
}

export default drizzleConnect(Create, mapState, mapDispatch);
