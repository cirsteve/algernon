import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import { zip } from 'lodash'
import PropTypes from 'prop-types'
import StakeButton from './StakeButton'

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
      stakes: this.props.Algernon.getTopicTagStakes[this.stakesKey] ?
        zip.apply(this, Object.values(this.props.Algernon.getTopicTagStakes[this.stakesKey].value)) : []
    }
  }

  render () {
    const { address, tag, hashedContent, hash, tagId, topicId } = this.props
    const { stakeTotal, stakes } = this.getRenderValues();

    const userStake = stakes.find(stake => address === stake[2])
    console.log('stakes: ', stakes, userStake)

    let title = ''
    if (hashedContent[hash]) {
      title = hashedContent[hash].title
    }

    return (
      <span>
        <StakeButton topicId={topicId} tagId={tagId} userStake={userStake} stakeTotal={stakeTotal} topicTitle={title} tag={tag} />
      </span>
    )
  }
}

Stake.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    address: state.accounts[0],
    hashedContent: state.data.hashedContent,
    Algernon: state.contracts.Algernon
  }
}


export default drizzleConnect(Stake, mapState);
