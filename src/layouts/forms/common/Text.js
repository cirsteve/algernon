import React from 'react'
import TextField from '@material-ui/core/TextField'

export default props =>
  <TextField
    autoFocus
    onChange={props.onChange}
    id={props.name}
    label={props.label}
    type={props.type}
    fullWidth
    value={props.value} />
