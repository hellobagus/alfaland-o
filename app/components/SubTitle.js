import React, { Component } from "react";
import { 
    View,
} from "react-native";
import { Text } from 'native-base'
import Style from '../Theme/Style';
class SubTitle extends Component {
    render() {
        return (
            <View style={nbStyle.subWrap}>
                <Text style={nbStyle.Subtitle}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}
export default SubTitle;

const nbStyle = {
    subWrap : {
        marginVertical : 10
    },
    subTitle :{
        fontSize : 12,
        fontFamily: 'Montserrat-SemiBold',
        color : "#4E4E4E"
    },
}