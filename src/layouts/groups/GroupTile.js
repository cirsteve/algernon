import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../common/SimpleCard'

export default ({ id, url, title, description }) => {
    const urlLink = <a href={`//${url}`} target="blank">{url}</a>
    const header = <Link to={`/groups/${id}`}>{title}</Link>
    return <Card title={urlLink} header={header} text={description} />
  }
