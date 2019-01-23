import React from 'react'
import Item from './Item'
import PrivateItem from './PrivateItem'

export default ({ids, privateTopics, tagId, userStakeIds }) => ids.length ?
  ids.map(id =>
    privateTopics ?
      <PrivateItem key={id} id={id} linkTo={`/privatetopics/${id}`} />
      :
      <Item key={id} id={id} tagId={tagId} userStakeIds={userStakeIds} linkTo={`/topics/${id}`} />
    )
  :
  'no topics'
