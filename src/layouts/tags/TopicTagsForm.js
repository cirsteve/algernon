import React, { Component } from 'react'
import PropTypes from 'prop-types';
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
    const updatedIds = [...this.state.tagIds]
    this.props.onSubmit(updatedIds)
    console.log('tsag form submit: ', this.props, updatedIds)
    let trx = this.context.drizzle.contracts.Algernon.methods.updateTopicTags.cacheSend(updatedIds, this.props.topicId)
    console.log('just cache sent: ', trx)
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
