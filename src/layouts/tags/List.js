import React from 'react'
import Item from './Item'

export default ({ ids }) => ids.length ?
  ids.map(id => <Item key={id} index={id}  />)
  :
  'no tags'
