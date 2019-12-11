import React from 'react'
import { Bars } from 'svg-loaders-react'

const styles = {
  width: '100%',
  height: 400,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const Loader = () => (
  <div style={styles}><Bars /></div>
)

export default Loader