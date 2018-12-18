import React from 'react'
import schema from '../../schemas/topic'
import Create from './Create'

export default ({tags}) =>
  <Create
    schema={schema}
    options={{tags: tags.map((tag, idx) => ({value: idx, label:tag})) }}
    contractSubmit='createTopic'
    submitLabel='Submit Topic'
    buttonText='Create Topic'
    dialogText='Fill Out the Fields Below to Add a Topic' />
