import React from 'react'
import { ListItem, Thumbnail, Body, Text, Separator } from 'native-base'
import {Navigation} from 'react-native-navigation'

export default class Hero extends React.Component{

    constructor(props){
        super(props);

    }

    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps : {
                    hero : this.props.hero,
                    text : 'bismillah'
                }
            }
        })
    }
    render(){
        return(
            <ListItem
            onPress={()=>this.goToScreen('screen.HeroesView')}
            key>
                <Thumbnail square 
                size={80}
                source = {{uri: this.props.hero.imageUri}}
                />
                <Body>
                    <Text>{this.props.hero.name}</Text>
                    <Text>{this.props.hero.title}</Text>
                </Body>
            </ListItem>
        )
    }
}

