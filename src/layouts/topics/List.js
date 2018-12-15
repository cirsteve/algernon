import React from 'react'
import Item from './Item'
import { range } from 'lodash'

export default ({count, address}) => count ? range(count).map(idx => <Item key={idx} idx={idx} address={address} />) : 'no topics'
