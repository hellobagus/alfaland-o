import React from 'react'
import {Navigation} from 'react-native-navigation'
import {registerScreen} from './app/Screens/screens'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

registerScreen();

Navigation.events().registerAppLaunchedListener(()=>{
    Navigation.setRoot({
        root : {
          component : {
            name : 'Initializing'
          }
        }
    })
})
