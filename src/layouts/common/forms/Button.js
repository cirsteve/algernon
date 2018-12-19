import React from 'react'
import Button from '@material-ui/core/Button'

export default ({onClick, text}) =>
  <Button variant='contained' onClick={onClick} color="primary">
    {text}
  </Button>
