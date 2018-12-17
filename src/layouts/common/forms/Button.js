import React from 'react'
import Button from '@material-ui/core/Button'

export default ({onClick, text}) =>
  <Button onClick={onClick} color="primary">
    {text}
  </Button>
