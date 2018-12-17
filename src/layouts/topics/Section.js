import React from 'react'
import List from './List'
import CreateTopic from '../ui/CreateTopic'


export default ({topicIds}) =>
  <div>
    <CreateTopic />
    {topicIds ?
      <List ids={topicIds} />
      :
      'Loading Topics...'
    }
  </div>
