import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Stake from '../stakes/Stake'
import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
  chip: {
    backgroundColor: 'rgba(74, 144, 226, 1)',
    color: 'white',
    borderRadius: '45px',
    padding: '5px 10px',
    marginLeft: '5px'
  },
  cursor: {
    pointer: 'cursor'
  },
  tag: {
    color: 'white',
    marginRight: '10px',
    textDecoration: 'none'
  }
});

class Item extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Algernon.methods
    this.userStakesKey = this.methods.getUserStakeIds.cacheCall(props.address)
    this.tagKey = this.methods.getTag.cacheCall(props.idx)
  }

  getRenderValues = () => {
    return {
      tag: this.props.Algernon.getTag[this.tagKey] ?
        this.props.Algernon.getTag[this.tagKey].value : '-',
      userStakeIds: this.props.Algernon.getUserStakeIds[this.userStakesKey] ?
        this.props.Algernon.getUserStakeIds[this.userStakesKey].value : 0
    }
  }


  render () {
    const {idx, topicTitle, topicId, hash, classes} = this.props
    const { tag, userStakeIds } = this.getRenderValues();
    return (
      <div className={classes.chip}>
        <Link className={classes.tag} to={`/tag/${idx}`}>
          {tag}
        </Link>

        <Stake
          topicTitle={topicTitle}
          tag={tag}
          tagId={idx}
          topicId={topicId}
          hash={hash}
          userStakeIds={userStakeIds} />
      </div>
    )
  }
}

Item.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    address: state.accounts[0],
    Algernon: state.contracts.Algernon
  }
}

export default withStyles(styles, {withTheme: true})(drizzleConnect(Item, mapState));
