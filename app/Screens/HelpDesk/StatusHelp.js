import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import {
    Container,
    Content,
    Text,
    DatePicker, Button, Card
} from 'native-base'
import moment from 'moment'
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import nbStyles from './Style'
import Style from '@Theme/Style'
import Star from 'react-native-star-view';
import LiveChat from 'react-native-livechat'
import CardTicket from '@Component/HelpDesk/CardTicket'
import OfflineNotice from '@Component/OfflineNotice';

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';

export default class StatusHelp extends Component {
    _isMount = false;
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
            isDisabled : false,

            dataTower : [],
            dataStatus : [],
            dataTicket : [],
            dataTicketWhereStatus : [],

            email : '',
            debtor : '',
            group : '',
        }
        Navigation.events().bindComponent(this);
    }

    async componentDidMount(){
        this._isMount = true;
        const data = {
            email : await _getData('@User'),
            group : await _getData('@Group'),
            debtor : await _getData('@UserId'),
            dataTower : await _getData('@UserProject')
        }

        this.setState(data,()=>{
            this.getTicketStatus(data.dataTower)
        })
    }

    componentWillUnmount(){
        this._isMount = false;
    }

    getTicketStatus = (data) => {
        const dT = data[0]

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email
        }

        fetch(urlApi+'c_ticket_history/getTicketStatus/'+dT.db_profile,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log('res',res);
            if(this._isMount){
                if(res.Error === false){
                    let resData = res.Data
                        this.setState({dataStatus : resData})
                }
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
            if(this._isMount){
                console.log('resTicket Where Status',res);
                if(res.Error === false){
                    const resData = res.Data
                    // this.setState({dataTicketWhereStatus : resData})
                    this.goToScreen(resData,'screen.ViewHistoryStatus')
                } else {
                    this.setState({isDisabled:false})
                }
            }
            // console.log('datar', res)
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

    handleNavigation =(data,ticketStatus)=>{
        this.setState({isDisabled:true},()=>{
            this.getTicketWhereStatus(data,ticketStatus);
        })
    }

    componentDidDisappear(){
        this.setState({isDisabled:false})
    }

    goToScreen = (data,screenName) => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
                passProps : {
                    dataTicket : data,
                    email : this.state.email
                }
            }
        })
    }

    render() {
        const ds = this.state.dataStatus

        return (
            <Container>
                <OfflineNotice/>
                <Content>
                <View style={nbStyles.wrap}>
                    <Text style={nbStyles.title}>Status HelpDesk</Text>
                </View>                
                <View >
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'R'")} disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Open"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/open(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntopen, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649' } }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'A'")} disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Assign"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/assign(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntassign, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649' } }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'S'")} disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Need Confirmation"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/need_confirm(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntneed, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649' } }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'F'")} disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Confirm"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/confirm(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntconfirm, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649' } }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'P'")} disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Proses"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/proses(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntprocces, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649' } }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'V'")} disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Solve"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/solved(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntsolve, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649' } }}

                        />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'A','S','M','P','F','Z'")}  disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{  borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8  }}
                            title="On Progress"
                            titleStyle={{ fontSize: 16}}
                            avatar={
                                <Image source={require('@Asset/images/icon_status/proses.png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntprogres, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649'  } }}
                        />
                    </TouchableOpacity> */}
                    
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'C'")}   disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Close"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/close(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntclose, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649'  } }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'D'")}  disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Rating"
                            titleStyle={{ fontSize:16}}
                            avatar={
                                <Image source={require('@Asset/images/icon-status-helpdesk/rating(blue).png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntrating, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#42B649'  } }}
                        />
                    </TouchableOpacity>
                </View>
                {/* {
                    this.state.dataTicket.map((data,key)=>
                        <CardTicket data={data} key={key} email={this.state.email} {...this.props}/>
                    )
                } */}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    
    img: {
        borderRadius: 10,
        height: 50,
        width: 50,
        marginTop: 10
    }
});
  starStyle = {
    width: 100,
    height: 20,
    marginBottom: 20,
};