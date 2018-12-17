import React from 'react'
import schema from '../../schemas/topic'
import Create from './CreateButton'

export default ({id,offChainFields}) =>
  <Create
    schema={schema}
    submitArgs={[id]}
    contractFields={[]}
    offChainFields={offChainFields}
    contractSubmit='updateTopic'
    buttonText='Update Note'
    dialogText='Fill Out the Fields Below to Add a Topic' />
