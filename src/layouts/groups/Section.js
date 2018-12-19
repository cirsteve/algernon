import React from 'react'
import List from './List'
import CreateGroup from '../ui/CreateGroup'


export default ({groupIds, tags}) =>
  <div>
    <CreateGroup tags={tags} />
    {groupIds ?
      <List ids={groupIds} />
      :
      'Loading Groups...'
    }
  </div>
