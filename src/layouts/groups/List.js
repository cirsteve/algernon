import React from 'react'
import Item from './Item'

export default ({ids, groups}) => ids ?
  ids.length ?
    ids.map(id => <Item key={id} id={id} />)
    :
    'no groups'
  :
  groups ?
    groups.groupIds.length ?
      groups.groupIds.map(id => <Item key={id} id={id} />)
      :
      'no groups'
    :
    'loading'
