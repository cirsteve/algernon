import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Text from '../common/forms/Text'
import IconSubmit from '../common/forms/IconSubmit'
import Fab from '@material-ui/core/Fab';
import PlusIcon from '@material-ui/icons/AddCircleOutline'
import MinusIcon from '@material-ui/icons/RemoveCircleOutline'
import Dialog from '../common/Dialog'

const UPDATE_TYPES = {
  ADD: 'ADD',
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE'
}

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  button: {
    cursor: 'pointer'
  },
  dialog: {
    alignContent: 'center'
  }
});

class Form extends Component {
  constructor (props, context) {
    super(props)

    this.state = {
      showForm: false,
      amount:0,
      updateType: UPDATE_TYPES.ADD
    }
  }

  updateAmount = (e) => this.setState({...this.state, amount: parseInt(e.target.value)})

  showForm = (type) => this.setState({...this.state, showForm: true, updateType: type})

  toggleDialog = showForm => this.setState({...this.state, showForm})

  submitAdd = () => {
    const {topicId, tagId} = this.props
    const {amount} = this.state

    this.context.drizzle.contracts.Algernon.methods.addStake.cacheSend(
      topicId,
      parseInt(tagId),
      parseInt(amount)
    )

    this.setState({...this.state, amount:0})
  }

  submitIncrease = () => {
    const {userStake} = this.props
    const {amount} = this.state

    this.context.drizzle.contracts.Algernon.methods.increaseStake.cacheSend(
      userStake[0],
      amount
    )

    this.setState({...this.state, amount:0})
  }

  submitDecrease = () => {
    const {userStake} = this.props
    const {amount} = this.state

    this.context.drizzle.contracts.Algernon.methods.reduceStake.cacheSend(
      userStake[0],
      amount
    )

    this.setState({...this.state, amount:0})
  }

  onCancel = () => this.setState({...this.state, updateType: UPDATE_TYPES.ADD, amount:0})

  render () {
    const {userStake, stakeTotal, topicTitle, tag, classes} = this.props

    let onSubmit, description;
    if (this.state.updateType === UPDATE_TYPES.ADD && !userStake) {
      onSubmit = this.submitAdd
      description =
        <span>
          Stake {this.state.amount} tokens to the combination of the tag <h3>{tag}</h3> and the topic <h3>{topicTitle}</h3>
        </span>
    } else if  (this.state.updateType === UPDATE_TYPES.INCREASE) {
      onSubmit = this.submitIncrease
      description =
        <span>
          Increase your stake by {this.state.amount} to the combination of the tag <h5>{tag}</h5> and the topic <h5>{topicTitle}</h5>
        </span>
    } else if (this.state.updateType === UPDATE_TYPES.DECREASE) {
      onSubmit = this.submitDecrease
      description =
        <span>
          Decrease your stake by {this.state.amount} token to the combination of the tag <h5>{tag}</h5> and the topic <h5>{topicTitle}</h5>
        </span>
    } else {
      description =
        <div>
          <div>
            <Fab onClick={this.showForm.bind(this, UPDATE_TYPES.DECREASE)} color="error" aria-label="Edit" className={classes.fab}>
              <MinusIcon />
            </Fab>
            <Fab onClick={this.showForm.bind(this, UPDATE_TYPES.INCREASE)} color="error" aria-label="Edit" className={classes.fab}>
              <PlusIcon />
            </Fab>

          </div>
          <span>
            on the combination of the tag <h5>{tag}</h5> and the topic <h5>{topicTitle}</h5>
          </span>
        </div>
    }

    const updateAmount = userStake ?
      this.state.updateType === UPDATE_TYPES.INCREASE ?
        parseInt(userStake[1]) + this.state.amount
        :
        parseInt(userStake[1]) - this.state.amount
      :
      null

    const updateInfo = updateAmount ?
      <div>
        {userStake[1]}
        <div>
          {UPDATE_TYPES.INCREASE === this.state.updateType ?
            '+'
            :
            '-'
          }
          {this.state.amount}
        </div>
        <div>
          {updateAmount}
        </div>
      </div>
      :
      null

    const form = userStake && this.state.updateType === UPDATE_TYPES.ADD ?
      <div>
        Your current stake is
        <h2>
          {userStake[1]} tokens
        </h2>
      </div>
      :
      <div>
        <Text value={this.state.amount} onChange={this.updateAmount} />
        {updateInfo}
        <IconSubmit onSubmit={onSubmit} onCancel={this.onCancel} />
      </div>

    const content =
      <div>
        {form}
        <p>
          {description}
        </p>
      </div>

    return (
      <span>
        <span className={classes.button} onClick={this.toggleDialog.bind(this, true)}>
          {stakeTotal}
        </span>
        <div className={classes.dialog}>
        <Dialog
          dialogTitle=''
          open={this.state.showForm}
          handleClose={this.toggleDialog.bind(this, false)}
          content={content} />
        </div>
      </span>
    )
  }
}

Form.contextTypes = {
  drizzle: PropTypes.object
}


export default withStyles(styles)(Form)
