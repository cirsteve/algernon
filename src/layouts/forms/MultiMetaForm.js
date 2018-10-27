import React, { Component, Fragment } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import DialogForm from './DialogForm'


const Item = ({label, type, typeOptions, add, remove, update}) =>
  <div>
    <TextField value={label} onChange={update.bind(this, 'label')} />
  </div>

export default class MultiMetaForm extends Component {
  constructor (props) {
    super (props)
    this.state ={
      fields: [...props.fields]
    }
  }

  addField = () => {
    let fields = [...this.state.fields]
    fields.push({...this.props.fieldOptions[0]})
    this.setState({fields})
  }

  removeField = index => {
    let fields = [...this.state.fields]
    fields.splice(index, 1)
    this.setState({fields})
  }

  updateField = (index, attr, e) => {
    let fields = [...this.state.fields]
    let field = fields.splice(index, 1)
    field[attr] = e.target.value
    fields.splice(index, 0, field)
    this.setState({fields})
  }

  render () {
    const content = (
      <Fragment>
        <Button onClick={this.addField}>Add Field</Button>
        {this.state.fields.map((f, i) => {
          return (
            <Item key={f.label}
              {...f}
              typeOptions={this.props.typeOptions}
              remove={this.removeField.bind(this, i)}
              update={this.updateField.bind(this, i)} />)
            }
          )}
      </Fragment>)
    return (
      <DialogForm {...this.props} content={content} />


    )
  }
}
