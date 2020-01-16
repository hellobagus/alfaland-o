import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    AsyncStorage
} from "react-native";
import {
    Container,
    Content,
    Text,
    DatePicker, Button, Card
} from 'native-base'
import nbStyles from './Style'
import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { ListItem, Icon } from 'react-native-elements';
import Star from 'react-native-star-view';
import CardTicket from '@Component/HelpDesk/CardTicket'
import OfflineNotice from '@Component/OfflineNotice';

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';


class ViewHistory extends Component {
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

    constructor(props){
        super(props)

        this.state = {
            dataTicket : props.dataTicket,
            email : ''
        }

        console.log('props', props.dataTicket)

    }

    async componentWillMount(){
        const data = {
            email : await _getData('@User'),
        }

        this.setState(data)
    }

    render() {
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Text style={nbStyles.title}>View History Ticket</Text>
                        </View>
                    </View>                    
                        <View style={styles.listview}>
                            {
                                this.state.dataTicket.map((data,key)=>
                                
                                    <CardTicket data={data} key={key} email={this.state.email} {...this.props}/>
                                
                                )
                            }
                        </View>
                </Content>
            </Container>
        );
    }
}
export default ViewHistory;

const styles = StyleSheet.create({
    listview: {
        marginTop: 54
    },
    listitemm: {
        height: 100
    }
});
const starStyle = {
    width: 100,
    height: 20,
    marginBottom: 20,
};