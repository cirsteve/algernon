import React from 'react'
import Item from './Item'
import { range } from 'lodash'

export default ({ids}) => ids.length ? ids.map(id => <Item key={id} id={id}  />) : 'no topics'
