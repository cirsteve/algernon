import React, { Component } from 'react'
import { drizzleConnect } from 'drizzle-react'
import PropTypes from 'prop-types'
import {range} from 'lodash'
import TagItem from './tags/Item'
import TagForm from './tags/MasterTagForm'

class Tags extends Component {
  constructor (props, context) {
    super(props)
    this.methods = context.drizzle.contracts.Groups.methods
    this.tagCountKey = this.methods.getTagCount.cacheCall()

    this.state = {
      tag: ''
    }
  }

  updateTag = (e) => this.setState({...this.state, tag: e.target.value})

  getRenderValues = () => ({
    tagCountResponse: this.props.Groups.getTagCount[this.tagCountKey] ?
      Object.values(this.props.Groups.getTagCount[this.tagCountKey].value) : null
  })

  render () {
    const {tagCountResponse} = this.getRenderValues()
    let tags = 'loading'

    if (Array.isArray(tagCountResponse)) {
      const count = parseInt(tagCountResponse[0])
      if (count) {
        tags = range(count).map(idx => <TagItem key={idx} idx={idx} />)
      } else {
        tags = 'No tags'
      }
    }

    return (
      <div>
        <h3>Tags</h3>
        <TagForm />
        {tags}
      </div>
    )
  }
}

Tags.contextTypes = {
  drizzle: PropTypes.object
}

const mapState = state => {
  return {
    Groups: state.contracts.Groups
  }
}

export default drizzleConnect(Tags, mapState)
