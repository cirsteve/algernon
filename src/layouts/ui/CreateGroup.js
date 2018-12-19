import React from 'react'
import schema from '../../schemas/group'
import Create from './Create'

export default ({tags}) =>
  <Create
    schema={schema}
    options={{tags: tags.map((tag, idx) => ({value: idx, label:tag})) }}
    contractSubmit='createGroup'
    submitLabel='Submit Group'
    buttonText='Create Group'
    dialogText='Fill Out the Fields Below to Create a Group' />
