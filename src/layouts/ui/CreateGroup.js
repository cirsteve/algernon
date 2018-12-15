import React, { Component, Fragment } from 'react'
import schema from '../../schemas/group'
import Create from './Create'

export default () =>
  <Create
    schema={schema}
    contractSubmit='createGroup'
    submitLabel='Submit Group'
    buttonText='Create Group'
    dialogText='Fill Out the Fields Below to Create a Group' />
