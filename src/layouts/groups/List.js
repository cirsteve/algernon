import React from 'react'
import Item from './Item'

export default ({ids}) => ids ? ids.length ? ids.map(id => <Item key={id} id={id} />) : 'no groups' :'loading'
