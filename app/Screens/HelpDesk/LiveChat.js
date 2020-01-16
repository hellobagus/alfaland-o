import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation'

export default class LiveChat extends Component {
  static options(passProps){
    return {
        topBar : {
            noBorder:true
        }
    }
}

constructor(props){
    super(props);

    Navigation.events().bindComponent(this);
    
}

goToScreen = (screenName) => {
    Navigation.push(this.props.componentId,{
        component:{
            name : screenName
        }
    })
}
  
  

  render() {
    return (
      <View>
<LiveChat movable={false} license="10542457" />
  />
      </View>
    );
  }
}

