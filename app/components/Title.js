import React, { Component } from "react";
import { 
    View,
} from "react-native";
import { Text } from 'native-base'

class Title extends Component {
    render() {
        return (
            <View style={nbStyle.subWrap}>
                <Text style={nbStyle.title}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}
export default Title;

const nbStyle = {
    subWrap : {
        marginVertical : 15
    },
    title :{
        fontSize : 25,
        fontFamily: 'Montserrat-SemiBold',
        color : "#333"
    },
}