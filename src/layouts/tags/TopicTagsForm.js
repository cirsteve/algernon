import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {difference, findIndex, reverse} from 'lodash'
import Select from '../common/forms/Select'
import IconSubmit from '../common/forms/IconSubmit'

class Form extends Component {
  constructor (props, context) {
    super(props)

    this.state = {
      tagIds: null
    }
  }

  updateTag = (e) => this.setState({...this.state, tagIds: e.target.value})

  onSubmit = () => {
    const {topicId} = this.props
    const removedIds = reverse(difference(this.props.tagIds, this.state.tagIds))
    const removedIdxs = removedIds.map(id => findIndex(this.props.tagIds, i=> i === id))
    const topicTagIdxs = removedIds.map(id => findIndex(this.props.tagTopicIds[id], i => i === topicId))
    const addedIds = difference(this.state.tagIds, this.props.tagIds, this.props.tagTopicIds)
    console.log('tag update: ', topicId, addedIds, removedIds, removedIdxs, topicTagIdxs, this.props.tagTopicIds)
    if (addedIds.length) {
      this.context.drizzle.contracts.Algernon.methods.updateTopicTags.cacheSend(
        addedIds,
        removedIds,
        removedIdxs,
        topicTagIdxs,
        topicId
      )
    } else {
      this.context.drizzle.contracts.Algernon.methods.removeTopicTags.cacheSend(
        removedIds,
        removedIdxs,
        topicTagIdxs,
        topicId
      )
    }



    this.setState({...this.state, tagIds:null})
  }

  onCancel = () => {
    this.props.onCancel()
    this.setState({...this.state, tagIds:null})
  }

  render () {
    const {options, tagIds} = this.props
    return (
      <div>
        <IconSubmit onSubmit={this.onSubmit} onCancel={this.onCancel} />
        <Select multiple options={options} onChange={this.updateTag} value={this.state.tagIds || tagIds} />
      </div>
    )
  }
}

Form.contextTypes = {
  drizzle: PropTypes.object
}


export default Form
