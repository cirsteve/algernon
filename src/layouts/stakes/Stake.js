import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import { zip } from 'lodash'
import PropTypes from 'prop-types'
import StakeForm from './StakeForm'

class Stake extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Algernon.methods
    this.stakeTotalKey = this.methods.getTopicTagStakeTotal.cacheCall(props.topicId, props.tagId)
    this.stakesKey = this.methods.getTopicTagStakes.cacheCall(props.topicId, props.tagId)


  }

  getRenderValues = () => {
    return {
      stakeTotal: this.props.Algernon.getTopicTagStakeTotal[this.stakeTotalKey] ?
        this.props.Algernon.getTopicTagStakeTotal[this.stakeTotalKey].value : 0,
      stakes: this.props.Algernon.getTopicTagStakeTotal[this.stakeTotalKey] ?
        zip(Object.values(this.props.Algernon.getTopicTagStakeTotal[this.stakeTotalKey].value)) : []
    }
  }

  render () {
    const { address, topicId, tagId } = this.props
    const { stakeTotal, stakes } = this.getRenderValues();

    const userStake = stakes.find(stake => address === stake[2])

    return (
      <div>
        <div>
          {stakeTotal}
        </div>
        <StakeForm topicId={topicId} tagId={tagId} userStake={userStake} />
      </div>
    )
  }
}

Stake.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    address: state.accounts[0],
    Algernon: state.contracts.Algernon
  }
}

export default drizzleConnect(Stake, mapState);
