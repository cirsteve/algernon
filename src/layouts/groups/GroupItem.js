import React from 'react'
import IpfsContent from '../common/IpfsContent'

export default props =>
  <div>
    <div>
      owner: {props.owner}
    </div>
    <div>
      fee: {props.fee}
    </div>
    <div>
      limit: {props.limit}
    </div>
    <IpfsContent hash={props.hash} />
  </div>
