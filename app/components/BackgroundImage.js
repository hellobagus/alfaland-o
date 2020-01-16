import {
    Dimensions,
    Image,
  } from 'react-native'
  import React from 'react'
  
  const BackgroundImage = (props) => {
    const window = Dimensions.get('window')
    const height = props.height || window.height
    const width = window.width
    const resizeMode = props.resizeMode || 'cover' // cover
    return (
      <Image
        style={[props.styles, {height: height - props.headerSize, width: null, resizeMode: resizeMode }]}
        opacity={1}
        source={props.uri ? {uri: props.uri} : props.source}
      >
        {props.children}
      </Image>
    )
  }
  
  export default BackgroundImage