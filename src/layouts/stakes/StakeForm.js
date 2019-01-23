import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Text from '../common/forms/Text'
import Button from '../common/forms/Button'
import IconSubmit from '../common/forms/IconSubmit'
import Fab from '@material-ui/core/Fab';
import PlusIcon from '@material-ui/icons/AddCircleOutline';
import MinusIcon from '@material-ui/icons/RemoveCircleOutline';

const UPDATE_TYPES = {
  ADD: 'ADD',
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE'
}

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
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

  updateAmount = (e) => this.setState({...this.state, amount: e.target.value})

  showForm = (type) => this.setState({...this.state, showForm: true, updateType: type})

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

  onCancel = () => {
    this.props.onCancel()
    this.setState({...this.state, tagIds:null})
  }

  render () {
    const {userStake, classes} = this.props
    const showFormInput = userStake ?
      <div>
        <Fab onClick={this.showForm.bind(this, UPDATE_TYPES.DECREASE)} color="error" aria-label="Edit" className={classes.fab}>
          <MinusIcon />
        </Fab>
        <Fab onClick={this.showForm.bind(this, UPDATE_TYPES.INCREASE)} color="error" aria-label="Edit" className={classes.fab}>
          <PlusIcon />
        </Fab>
      </div>
      :
      <Button onClick={this.showForm.bind(this, UPDATE_TYPES.ADD)} text='Add Stake' />

    let onSubmit;
    switch(this.state.updateType) {
      case UPDATE_TYPES.ADD:
        onSubmit = this.submitAdd
        break
      case UPDATE_TYPES.INCREASE:
        onSubmit = this.submitIncrease
        break
      case UPDATE_TYPES.DECREASE:
        onSubmit = this.submitDecrease
        break
      default:
        onSubmit = this.submitAdd
    }
    const updateAmount = userStake && this.state.updateType !== UPDATE_TYPES.ADD ?
      this.state.updateType === UPDATE_TYPES.INCREASE ?
        userStake[1] + this.state.amount
        :
        userStake[1] - this.state.amount
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

    const content = this.state.showForm ?
      <div>
        <Text value={this.state.amount} onChange={this.updateAmount} />
        {updateInfo}
        <IconSubmit onSubmit={onSubmit} onCancel={this.onCancel} />
      </div>
      :
      showFormInput

    return (
      <div>
        {content}

      </div>
    )
  }
}

Form.contextTypes = {
  drizzle: PropTypes.object
}


export default withStyles(styles)(Form)
