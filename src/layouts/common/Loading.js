import React from 'react';
import ReactLoading from 'react-loading';

export default ({ icon, color, height, width }) => (
    <ReactLoading type={icon || 'bars'} color={color || '#12AA11'} height={height || 60} width={width || 60} />
)
