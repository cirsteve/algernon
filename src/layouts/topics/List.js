import React from 'react'
import Item from './Item'

export default ({ids, privateTopics }) => ids.length ?
  ids.map(id =>
    privateTopics ?
      <Item key={id} id={id} method='getPrivateTopic' linkTo={`/privatetopics/${id}`}  />
      :
      <Item key={id} id={id} method='getTopic' linkTo={`/topics/${id}`} />
    )
  :
  'no topics'
