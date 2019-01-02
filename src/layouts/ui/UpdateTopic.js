import React from 'react'
import schema from '../../schemas/topic'
import Create from './CreateButton'

export default ({id,offChainFields, onSubmit}) =>
  <Create
    useIcon={true}
    schema={schema}
    submitArgs={[id]}
    contractFields={[]}
    offChainFields={offChainFields}
    contractSubmit='updateTopic'
    onSubmit={onSubmit}
    buttonText='Update Note'
    dialogText='Fill Out the Fields Below to Add a Topic' />
