import React, { Component, Fragment } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

import Text from '../common/forms/Text'
import Select from '../common/forms/Select'
import RichText from '../common/forms/RichText'
import DialogForm from '../common/DialogForm'
import Dialog from '../common/Dialog'

const INPUT_MAP = {
  string: props => <Text {...props} />,
  number: props => <Text {...props} />,
  url: props => <Text {...props} />,
  richText: props => <RichText {...props} />,
  select: props => <Select {...props} />
}

class Create extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods

    this.state = {
      open: false,
      openInfo: false,
      hashId: null,
      contractFields: this.props.schema.contract.reduce((acc, f) => {
        acc[f.name] = f.default;
        return acc;
      }, {}),
      offChainFields: this.props.schema.offChain.reduce((acc, f) => {
        acc[f.name] = f.default;
        return acc;
      }, {}),
    }
  }

  updateShowingForm = open => this.setState({...this.state, open})

  updateShowingInfo = openInfo => this.setState({...this.state, openInfo})

  updateContractField = (field, e, val) => {
    console.log('update c field', field, e)
    this.setState({
      ...this.state,
      contractFields: {
        ...this.state.contractFields,
        [field]: e.target.options ? e.target.options : e.target.value
      }
    })
  }

  updateOffChainField = (field, e, val) => {
    this.setState({
      ...this.state,
      offChainFields: {
        ...this.state.offChainFields,
        [field]: typeof e === 'string' ? e : e.target.value
      }
    })
  }

  submit = () => {
    const hashId = Math.ceil(Math.random() * 1000000000000);
    let submit = this.methods[this.props.contractSubmit].cacheSend;
    if (this.props.submitArgs) this.props.submitArgs.forEach(arg => submit = submit.bind(this, arg))
    this.props.schema.contract.forEach(field => submit = submit.bind(this, this.state.contractFields[field.name]))
    this.props.submit(JSON.stringify(this.state.offChainFields), submit, hashId)
    this.setState({...this.state, hashId, open: false, openInfo: true})
  }

  render () {
    const { schema, uploadedHashes, options, optionItems } = this.props

    const contractFields = [...schema.contract].map(f => {
      f.value = this.state.contractFields[f.name]
      f.onChange = this.updateContractField.bind(this, f.name)
      f.key = f.name
      f.options = options && options[f.name]
      f.optionItems = optionItems && optionItems[f.name]
      return f;
    })

    const offChainFields = [...schema.offChain].map(f => {
      f.value = this.state.offChainFields[f.name]
      f.onChange = this.updateOffChainField.bind(this, f.name)
      f.key = f.name
      f.options = options && options[f.name]
      f.optionItems = optionItems && optionItems[f.name]
      return f;
    })

    const fields = contractFields.concat(offChainFields).map(f => INPUT_MAP[f.type](f) )

    const dialogContent = this.state.hashId && uploadedHashes[this.state.hashId] ?
      'Complete Your Submission wtih MetaMask'
      :
      'Preparing Your Transaction'



    return (
      <Fragment>
        <Button onClick={this.updateShowingForm.bind(this, true)} color="primary">
          {this.props.buttonText}
        </Button>

        <DialogForm
          title={this.props.dialogFormTitle}
          open={this.state.open}
          text={this.props.dialogText}
          handleClose={this.updateShowingForm.bind(this, false)}
          submitLabel={this.props.submitLabel}
          onSubmit={this.submit}
          content={fields} />
        <Dialog
          title={this.props.dialogTitle}
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
    Groups: state.contracts.Groups,
    pendingUpload: state.data.pendingUpload,
    uploadedHashes: state.data.hashedContent
  }
}

const mapDispatch = (dispatch) => {
    return {
        submit: (upload, save, hashId) => dispatch({type: 'IPFS_UPLOAD_THEN_SAVE', payload: {upload, save, hashId}}),
        ipfsUploadAcked: () => dispatch({type: 'IPFS_UPLOAD_ACKED'})
    };
}

export default drizzleConnect(Create, mapState, mapDispatch);
