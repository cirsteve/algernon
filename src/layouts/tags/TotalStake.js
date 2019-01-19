import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'

class Stake extends Component {
  constructor (props, context) {
    super(props)
    this.stakeKey = context.drizzle.contracts.Algernon.methods
      .getTagStake.cacheCall(props.topicId, props.tagId)
  }

  getRenderValues = () => {
    return {
      stake: this.props.Algernon.getTagStake[this.stakeKey] ?
        this.props.Algernon.getTagStake[this.stakeKey].value : null
    }
  }

  render () {
    const { stake } = this.getRenderValues();

    return (
      <div>
        {stake ? stake : '-'}
      </div>
    )
  }
}

Stake.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Algernon: state.contracts.Algernon
  }
}

export default drizzleConnect(Stake, mapState);
