import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import MintForm from './token/MintForm'

const styles = theme => ({
  root: {
    maxWidth: '600px'
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  loadingTag: {
    display: 'flex',
    alignItems: 'center'
  }
});


class Token extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.AlgerToken.methods
    this.contractAddress = context.drizzle.contracts.AlgerToken.address

    this.contractBalanceKey = this.methods.balanceOf.cacheCall(this.contractAddress)
    this.totalSupplyKey = this.methods.totalSupply.cacheCall()
    this.nameKey = this.methods.name.cacheCall()
    this.symbolKey = this.methods.symbol.cacheCall()
    this.capKey = this.methods.cap.cacheCall()
  }

  getRenderValues = () => ({
    contractBalance: this.props.AlgerToken.balanceOf[this.contractBalanceKey] ?
      parseInt(this.props.AlgerToken.balanceOf[this.contractBalanceKey].value) : null,
    totalSupply: this.props.AlgerToken.totalSupply[this.totalSupplyKey] ?
      parseInt(this.props.AlgerToken.totalSupply[this.totalSupplyKey].value) : null,
    name: this.props.AlgerToken.name[this.nameKey] ?
      this.props.AlgerToken.name[this.nameKey].value : null,
    symbol: this.props.AlgerToken.symbol[this.symbolKey] ?
      this.props.AlgerToken.symbol[this.symbolKey].value : null,
    cap: this.props.AlgerToken.cap[this.capKey] ?
      this.props.AlgerToken.cap[this.capKey].value : null
  })

  render () {
    const {contractBalance, totalSupply, name, symbol, cap} = this.getRenderValues()
    const {classes} = this.props


    return (
      <div className={classes.root}>
        <h1>{name}</h1>
        <h3>{symbol}</h3>
        <div>
          Supply Cap: {cap}
        </div>
        <div>
          Total Supply: {totalSupply}
        </div>
        <div>
          Contract Balance: {contractBalance} <br/>
          Contract Address: {this.contractAddress}
        </div>
        <MintForm />
      </div>
    )
  }
}

Token.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    connectedAddress: state.accounts[0],
    AlgerToken: state.contracts.AlgerToken
  }
}

const mapDispatch = (dispatch) => {
    return {

    };
}

export default drizzleConnect(withStyles(styles)(Token), mapState, mapDispatch)
