import React, { Component } from "react";
import { 
    WebView
} from "react-native";
import {urlApi} from '@Config';

class Chat extends Component {
    static options(passProps) {
        return {
            topBar: {
                noBorder: true
            },
            bottomTabs :{
                visible : false,
                drawBehind: true, 
                animate: true
            }
        }
    }
    render() {
        const data = this.props.dataTicket
        const email = this.props.email
        return (
            <WebView
                source={{uri: urlApi+'ifca_splus_v2/c_chat_mobile/chat/'+email+'/'+data.reported_by+'/'+data.complain_no}}
                // source={{uri:'http://www.orimi.com/pdf-test.pdf'}}
            />
        );
    }
}
export default Chat;
