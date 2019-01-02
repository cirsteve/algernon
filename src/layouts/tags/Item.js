import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import Chip from './Chip'

class Item extends Component {
  constructor (props, context) {
    super(props)
    console.log('tag item', props.idx)
    this.tagKey = context.drizzle.contracts.Groups.methods.getTag.cacheCall(props.idx)
  }

  getRenderValues = () => {
    return {
      tagResponse: this.props.Groups.getTag[this.tagKey] ?
        this.props.Groups.getTag[this.tagKey].value : null
    }
  }

  render () {
    const { tagResponse } = this.getRenderValues();
    let tag = 'Loading Tag'

    if (tagResponse) {
      tag = <Chip label={tagResponse} />
    }

    return (
      <div>
        {tag}
      </div>
    )
  }
}

Item.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Groups: state.contracts.Groups
  }
}

const mapDispatch = (dispatch) => {
    return {
        getTags: (tag) => dispatch({type: 'TAG_RECEIVED', payload: {tag}})

    };
}

export default drizzleConnect(Item, mapState, mapDispatch);
