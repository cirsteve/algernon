import React from 'react'
import List from './List'
import CreateTopic from '../ui/CreateTopic'
import CreatePrivateTopic from '../ui/CreatePrivateTopic'
import DownloadTopics from '../ui/DownloadTopicsButton'


export default ({topicIds, tags, privateTopics, isOwner}) =>
  <div>
    {isOwner ?
      <div style={{marginBottom: '0.5em'}}>
        { privateTopics ? <CreatePrivateTopic tags={tags} /> : <CreateTopic tags={tags} />}
      </div>
      :
      null
    }

    {topicIds ?
      <List ids={topicIds} privateTopics={privateTopics} />
      :
      'Loading Topics...'
    }
  </div>
