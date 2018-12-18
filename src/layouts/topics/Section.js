import React from 'react'
import List from './List'
import CreateTopic from '../ui/CreateTopic'


export default ({topicIds, tags}) =>
  <div>
    <CreateTopic tags={tags} />
    {topicIds ?
      <List ids={topicIds} />
      :
      'Loading Topics...'
    }
  </div>
