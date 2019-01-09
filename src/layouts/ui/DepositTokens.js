import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';

class Deposit extends Component {

  submit = () =>
    this.props.deposit(
      this.context.drizzle.contracts.AlgerToken.methods.approve(this.context.drizzle.contracts.Algernon.address, this.props.value ).send,
      this.context.drizzle.contracts.Algernon.methods.depositTokens(this.props.value).send
    )


  render () {
    return (
      <Button variant="contained" onClick={this.submit} color="primary">
        Depsoit Tokens
      </Button>
    )
  }
}

Deposit.contextTypes = {
  drizzle: PropTypes.object
}


const mapDispatch = (dispatch) => {
    return {
        deposit: (approve, deposit) => dispatch({type: 'DEPOSIT_TOKENS', payload: {approve, deposit}})
    };
}
export default drizzleConnect(Deposit, () => ({}), mapDispatch);
