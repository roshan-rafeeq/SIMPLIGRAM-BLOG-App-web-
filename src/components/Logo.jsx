import React from 'react'
import logo from '/Logo_simpligram.png'
function Logo({width= '100%'}) {
  return (
    <img src={logo} style={{width}} alt="Simpligram logo"/>
  )
}

export default Logo