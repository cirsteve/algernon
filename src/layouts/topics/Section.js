import React from 'react'
import List from './List'
import CreateTopic from '../ui/CreateTopic'


export default ({count, address}) =>
  <div>
    <CreateTopic />
    <List count={count} address={address}/>
  </div>
