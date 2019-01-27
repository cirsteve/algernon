import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'


class Stake extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Algernon.methods
    this.stakeTotalKey = this.methods.getTopicTagStakeTotal.cacheCall(props.topicId, props.tagId)
  }

  getRenderValues = () => {
    return {
      stakeTotal: this.props.Algernon.getTopicTagStakeTotal[this.stakeTotalKey] ?
        this.props.Algernon.getTopicTagStakeTotal[this.stakeTotalKey].value : 0
    }
  }

  render () {
    const { stakeTotal } = this.getRenderValues();

    return (
      <div>
        <h1>{stakeTotal}</h1>
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
