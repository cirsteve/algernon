import React, { Component } from 'react'
import Text from '../common/forms/Text'
import AddTag from '../ui/AddMasterTag'

class Form extends Component {
  constructor (props, context) {
    super(props)

    this.state = {
      tag: ''
    }
  }

  clearInput = () => this.setState({...this.state, tag: ''})

  updateTag = (e) => this.setState({...this.state, tag: e.target.value})

  render () {
    return (
      <div>
        <Text onChange={this.updateTag} value={this.state.tag} />
        <AddTag tag={this.state.tag} clearInput={this.clearInput} />
      </div>
    )
  }
}



export default Form
