import React from 'react'
import schema from '../../schemas/topic'
import Create from './Create'

export default () =>
  <Create
    schema={schema}
    contractSubmit='createTopic'
    submitLabel='Submit Topic'
    buttonText='Create Topic'
    dialogText='Fill Out the Fields Below to Add a Topic' />
