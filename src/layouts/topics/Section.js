import React from 'react'
import List from './List'
import CreateTopic from '../ui/CreateTopic'
import CreatePrivateTopic from '../ui/CreatePrivateTopic'


export default ({topicIds, tags, privateTopics}) =>
  <div>
    { privateTopics ? <CreatePrivateTopic tags={tags} /> : <CreateTopic tags={tags} />}
    {topicIds ?
      <List ids={topicIds} privateTopics={privateTopics} />
      :
      'Loading Topics...'
    }
  </div>
