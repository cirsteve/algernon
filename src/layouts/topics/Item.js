import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { getMultihash } from '../../util/multihash'
import Tile from './TopicTile'
import Ipfs from '../common/Ipfs'


const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    margin: '2em 0',
  }
});

class Item extends Component {
  constructor (props, context) {
    super(props)
    this.topicKey = context.drizzle.contracts.Algernon.methods.getTopic.cacheCall(props.id)

  }

  getRenderValues = () => {
    return {
      topicResponse: this.props.Algernon.getTopic[this.topicKey] ?
        Object.values(this.props.Algernon.getTopic[this.topicKey].value) : null
    }
  }

  render () {
    const { noLink, linkTo, id, tagId, classes } = this.props
    const { topicResponse } = this.getRenderValues();
    let topic = 'Loading Topic'

    if (Array.isArray(topicResponse)) {
        const link = noLink ? null : linkTo
        topic =
          <Ipfs hash={getMultihash(topicResponse)} >
            <Tile link={link} id={id} tagId={tagId} />

          </Ipfs>

    }

    return (
      <div className={classes.root}>
        {topic}
      </div>
    )
  }
}

Item.contextTypes = {
  drizzle: PropTypes.object
}

// May still need this even with data function to refresh component on updates for this contract.
const mapState = state => {
  return {
    Algernon: state.contracts.Algernon
  }
}

export default withStyles(styles)(drizzleConnect(Item, mapState));
