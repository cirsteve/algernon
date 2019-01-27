import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import IconSubmit from '../common/forms/IconSubmit'
import Text from '../common/forms/Text'
import Button from '../common/forms/Button'

class Section extends Component {
  constructor (props, context) {
    super(props)

    this.state = {
      amount: 0,
      deposit: false,
      withdraw: false
    }
  }

  clearInput = () => this.setState({...this.state, amount: 0, deposit: false, withdraw: false})

  updateState = (field, e) => this.setState({...this.state, [field]: e.target ? e.target.value : e})

  submit = () => {
    this.context.drizzle.contracts.AlgerToken.methods.mint.cacheSend(this.state.to, this.state.amount)
    this.clearInput()
  }

  deposit = () => {
    this.props.deposit(
      this.context.drizzle.contracts.AlgerToken.methods.approve(this.context.drizzle.contracts.Algernon.address, this.state.amount ).send,
      this.context.drizzle.contracts.Algernon.methods.depositTokens(this.state.amount).send
    )
    this.clearInput()
  }

  withdraw = () => {
    this.context.drizzle.contracts.Algernon.methods.withdrawTokens.cacheSend(this.state.amount)
    this.clearInput()
  }

  render () {
    return (
      <div>
        <h2>Wallet Token Balance: {this.props.balance}</h2>
        <h2>Algernon Token Balance: {this.props.contractBalance}</h2>
        {this.state.deposit || this.state.withdraw ?
          <Text onChange={this.updateState.bind(this, 'amount')} value={this.state.amount} label="amount" type="number" />
          :
          null
        }
        {this.state.deposit ?
          <IconSubmit onCancel={this.clearInput} onSubmit={this.deposit} />
          :
          this.state.withdraw ?
            <IconSubmit onCancel={this.clearInput} onSubmit={this.withdraw} />
            :
            <div>
              <span style={{marginRight: '1em'}}>
                <Button onClick={this.updateState.bind(this, 'deposit', true)} text="Deposit" />
              </span>
              <Button onClick={this.updateState.bind(this, 'withdraw', true)} text="Withdraw" />
            </div>
        }
      </div>
    )
  }
}

Section.contextTypes = {
  drizzle: PropTypes.object
}



const mapDispatch = (dispatch) => {
    return {
        deposit: (approve, deposit) => dispatch({type: 'DEPOSIT_TOKENS', payload: {approve, deposit}})
    };
}
export default drizzleConnect(Section, () => ({}), mapDispatch);
