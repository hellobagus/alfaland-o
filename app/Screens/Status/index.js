import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity,SafeAreaView,ScrollView } from 'react-native';
import {
    Container,
    Content,
    Text,
    DatePicker, Button, Card
} from 'native-base'
import AsyncStorage from "@react-native-community/async-storage";
import moment from 'moment'
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import nbStyles from './Style'
import Style from '../../Theme/Style'
import Star from 'react-native-star-view';
import LiveChat from 'react-native-livechat'
import OfflineNotice from '@Component/OfflineNotice';

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';

export default class Status extends Component {
    static options(passProps) {
        return {
            topBar: {
                noBorder: true,
                height : 0
            },
            statusBar :{
                style : 'dark',
                backgroundColor :'#fff'
            },
            // bottomTabs :{
            //     visible : false,
            //     drawBehind: true, 
            //     animate: true
            // }
        }
    }

    constructor(props){
        super(props)

        this.state = {
            isDisabled : false,
            dataTower : [],
            dataTicket : [],
            dataTicketWhereStatus : [],

            email : '',
            debtor : '',
            group : '',
            token : ''
        }
        Navigation.events().bindComponent(this);

    }

    async componentWillMount(){
        const data = {
            email : await _getData('@User'),
            group : await _getData('@Group'),
            debtor : await _getData('@UserId'),
            token : await _getData('@Token'),
            dataTower : await _getData('@UserProject')
        }

        this.setState(data,()=>{
            this.getTicket(data.dataTower)
        })
    }

    getTower = () => {
        let email = this.state.email;

        fetch(urlApi+'c_product_info/getData/IFCAMOBILE/'+email,{
            method : "GET",
            headers : new Headers({
                'Token': this.state.token
            })
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data
                for(var i = 0 ; i < resData.length; i++){
                    
                    this.setState(prevState => ({
                        dataTower: [...prevState.dataTower, resData[i]]
                    }))
                }
                this.getTicket(resData)
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTicket = (data) => {
        const dT = data[0]
        // let endDate = this.state.endDate.getFullYear() + '/' + (this.state.endDate.getMonth() + 1) + '/'+ this.state.endDate.getDate()
        // let startDate = this.state.startDate.getFullYear() + '/' + (this.state.startDate.getMonth() + 1) + '/'+ this.state.startDate.getDate()

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email,
            group : this.state.group,
            date_end : '',
            date_start : '',
            status : "'A','S','M','P','F','Z','R'"
        }

        fetch(urlApi+'c_ticket_history/getDataTicketWhereStatus/IFCAPB/'+formData.group,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                this.setState({dataTicket : resData})
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTicketWhereStatus = (data,ticketStatus) => {
        const dT = data[0]
        // let endDate = this.state.endDate.getFullYear() + '/' + (this.state.endDate.getMonth() + 1) + '/'+ this.state.endDate.getDate()
        // let startDate = this.state.startDate.getFullYear() + '/' + (this.state.startDate.getMonth() + 1) + '/'+ this.state.startDate.getDate()

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email,
            group : this.state.group,
            date_end : '',
            date_start : '',
            debtor : this.state.debtor,
            status : ticketStatus
        }

        fetch(urlApi+'c_ticket_history/getDataTicketWhereStatus/IFCAPB/'+formData.group,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                // this.setState({dataTicketWhereStatus : resData})
                this.goToScreen(resData,'screen.ViewHistoryStatus')
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleIndexChange = (index) => {
        this.setState({
            ...this.state,
            selectedIndex: index,
        });

        console.log('Selected index', this.state.selectedIndex)
    }

    handleNavigation = (screenName) =>{
        this.setState({isDisabled:true},()=>{
            this.goToScreen(screenName);
        })
    }

    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
            }
        })
    }

    componentDidDisappear(){
        this.setState({isDisabled:false})
    }
    
    renderNullList(){
        return(
            <View style={nbStyles.nullList}>
                <Text style={[Style.textBlack,Style.textLarge]}>Data Not Available</Text>
            </View>
        )
    }

    render() {

        return (
            <Container>
                <SafeAreaView>
                <OfflineNotice/>
                <View style={nbStyles.wrap}>
                    <View style={nbStyles.subWrap}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={nbStyles.title}>Status</Text>
                            <TouchableOpacity disabled={this.state.isDisabled} style={nbStyles.btnHeaderOutline}
                                onPress={()=>this.handleNavigation('screen.StatusHelp')}>
                                <Text style={nbStyles.btnText}>Go To Status</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>    
                   
                <ScrollView>
                    {
                    this.state.dataTicket.length > 0 ?
                        this.state.dataTicket.map((data,key)=>
                        <Card style={{
                            height: null,
                            backgroundColor: 'white',
                            shadowOffset: { width: 1, height: 1 },
                            shadowColor: "#37BEB7",
                            shadowOpacity: 0.5,
                            elevation: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 10
                        }} key={key}>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '300',
                                        textAlign: 'left'
                                    }}>
                                        Ticket No : # {data.complain_no}
                                        </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '500',
                                        textAlign: 'right',
                                        color: '#9B9B9B'
                                    }}>
                                        Date : {moment(data.reported_date).format('DD-MM-YYYY')}
                                        </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        textAlign: 'left',
                                        color: '#F99B23'
                                    }}>
                                        {data.complain_type == "C" ? "Complain" : "Request"}
                                        </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                        textAlign: 'left',
                                        color: '#9B9B9B'
                                    }}>
                                        Work Requested
                                        </Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#F3F3F3', marginTop: 8 }} />
                                <View style={{ borderColor: '#f5f5f5', backgroundColor: '#f5f5f5', height: null, width: null }}>
                                    <Text style={{ fontSize: 12, fontWeight: '200', color: '#9B9B9B', padding: 8 }}>
                                        {data.work_requested}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '300',
                                        textAlign: 'left'
                                    }}>
                                        Status : {data.status == "R" ? "Open":
                                        data.status == "A" || data.status == "S" || data.status == "M" || data.status == "P" || data.status == "F" || data.status == "Z"  ? "On Progress":
                                        data.status == "C" ? "Completed":
                                        data.status == "D" ? "Done" :
                                        ""
                                        }
                                        </Text>
                                    <View style={styles.container}>

                                        {data.status === 'D' &&
                                            <Star score={data.rating_us} style={starStyle} />
                                        }
                                    </View>
                                </View>
                            </View>
                        </Card>
                    )
                    : 
                    this.renderNullList()
                    }
                    </ScrollView>
                </SafeAreaView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    listvieww: {
        marginTop: 20
    },
    img: {
        borderRadius: 10,
        height: 35,
        width: 35,
        marginTop: 10
    }
});
  starStyle = {
    width: 100,
    height: 20,
    marginBottom: 20,
};