import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    PanResponder,
    Image
} from "react-native";
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5';

class ListNotification extends React.PureComponent {
    constructor(props){
        super(props)

        this.state ={
            isRead : this.props.item.IsRead
        }

        
    }

    press = (item) =>{
        this.setState({isRead:1},()=>{
            this.props.onPress(item.NotificationID)
        })
    }
    

    render() {
        const item = this.props.item;
        const index = this.props.index;

        let colorStyle = {
            backgroundColor : this.state.isRead==1 ? '#fff' : '#ddfffa'
        }

        let textStyle = {
            color : this.state.isRead==1 ? '#A3A3A3' : '#333'
        }

        let padderStyle ={
            backgroundColor : this.state.isRead==1 ? '#E2E2E4' : '#ace0d7',
            width:'100%',height:0.5
        }

        let iconName = item.NotificationCd == "NEW" ?
        require('@Asset/images/icon-notif/open(blue).png') 
        : item.NotificationCd == "ASSIGN" ?
        require('@Asset/images/icon-notif/assign(blue).png') 
        : item.NotificationCd == "CLOSE" ?
        require('@Asset/images/icon-notif/close(blue).png') 
        : require('@Asset/images/icon-notif/confirm(blue).png')

        return(
                <View>
                    <TouchableWithoutFeedback 
                    onPress={()=> this.press(item)} 
                    onLongPress={()=>this.props.onLongPress(item)}>
                    <View style={[colorStyle,{flex:1,flexDirection:'row',paddingVertical: 20,paddingHorizontal: 5}]}>
                        <View style={{width:50, height:50,marginVertical:5,marginHorizontal:10,justifyContent:'center',alignItems:'center'}}>
                            {/* <Text style={{fontSize:50,color:'#333'}}>{item.NotificationCd.substr(0,1)}</Text> */}
                            <Image source={iconName} style={styles.img}/>
                        </View>
                        <View style={{flex:1,marginLeft:5,marginRight:20}}>
                            <Text style={{fontSize:14,color:'#333'}}>Ticket {item.NotificationCd.toLowerCase()}</Text>
                            <Text style={[textStyle,{fontSize:12,marginVertical:5}]}>{item.Remarks}</Text>
                            <View style={{flex:1, flexDirection:'row',alignItems:'center'}}>
                                <Icon name="clock" color="#B1B1B1"/>
                                <Text style={{fontSize:12,marginLeft:2,color:'#B1B1B1'}}>{moment(item.NotificationDate).format('DD-MM-YYYY HH:mm')}</Text>
                            </View>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>

                    <View style={padderStyle}>
                    </View>

                </View>
                
        )
    }
}
export default ListNotification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    img :{ 
        width : 50,
        height :50
    }
});