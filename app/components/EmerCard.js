import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions
} from "react-native";
import {Navigation} from 'react-native-navigation'
import Communications from 'react-native-communications';
const {width : vw, height : vh} = Dimensions.get("window");

class EmerCard extends Component {

    // componentDidMount(){
    // }

    constructor(props){
        super(props);
    }

    // componentWillMount(){
    //     let link = this.props.tapTo
    //     if(link){
    //         this.setState({linkTo:link})
    //     }
    // }

    // goToScreen = (screenName) => {
    //     Navigation.push(this.props.componentId,{
    //         component:{
    //             name : screenName
    //         }
    //     })
    // }
    render() {
        const { contact_name, contact_no,imgUrl } = this.props;
        return (
            <TouchableOpacity style={nbStyles.btnBox} onPress={() => Communications.phonecall(contact_no, true)}>
                <Image source={{uri : imgUrl}} style={nbStyles.btnImage}/>
                <Text style={nbStyles.btnText}>{contact_name}</Text>
            </TouchableOpacity>
        );
    }
}
export default EmerCard;

const nbStyles = {
    btnBox: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F4F5',
        borderRadius: 5,
        borderColor: '#42B649',
        borderWidth: 1,
        width : (vw + vh) * 0.11,
        height :(vw + vh) * 0.11,
    },
    btnImage : {
        height : 50,
        width : 50,
        marginBottom : 10
    },
};