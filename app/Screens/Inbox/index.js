import React from 'react'
import { StyleSheet, View,Platform, SafeAreaView} from 'react-native'
import { Container, Text } from 'native-base'
import nbStyles from './Style'
import ListNotification from '@Component/Notification/ListNotification'
import {Navigation} from 'react-native-navigation'
import OfflineNotice from '@Component/OfflineNotice';
import ListView from '@Component/ListView/ListView';
import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';
import Style from '../../Theme/Style';
export default class Inbox extends React.Component {

    static options(passProps) {
        return {
            topBar : {
                noBorder:true,
                visible : false,
                height : 0
            },
            statusBar :{
                style : 'dark',
                backgroundColor :'#fff'
            },
        }
    }

    constructor(props){
        super(props)
        this.state = {
            activeRow : null,

            email : '',
            dataNotification : [],
            badge : '',

            isReaded : 1,
            badge : '0'
        }
        console.log(props.scroll)
        Navigation.events().bindComponent(this);

    }

    async componentWillMount(){
        

    }

    async componentDidAppear(){
        const datas =  {
            email : await _getData("@User"),
            
        }

        this.setState({
            email : datas.email
        },()=>{
            this.getNotification()
        })
        // this.getBadge(datas)

        // this.setState({
        //     time: new Date(),
        //     timer: 
        // })

        // // ? RealTime
        // setInterval(() => {
        //     this.getBadge(datas) 
        // }, 1000)

        // ? Tidak RealTime
        this.getBadge(datas) 
    }

    getNotification = () => {
        const formData = {
            email : this.state.email
        }

        fetch(urlApi+'c_notification/getNotification/IFCAMOBILE',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            this.setState({dataOvertime:[]})
            if(res.Error === false){
                let resData = res.Data;
                this.setState({dataNotification : resData})
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    getBadge = async(data) =>{
        const formData = {
            email : data.email
        }

        await fetch(urlApi+'c_notification/getNotificationBadge/IFCAMOBILE',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            this.setState({badge : res.Data[0].cnt},()=>{
                this.setBadge(0)
            })

        }).catch((error) => {
            console.log(error);
        });
    }

    setBadge = (operator) =>{
        // console.log('notifbadge',data)
        const badge = this.state.badge + operator
        this.setState({badge:badge})
        const data = badge.toString()
        const isIos = Platform.OS === 'ios';
        if(data !== "0") {
            Navigation.mergeOptions(this.props.componentId, {
                bottomTab: {
                badge: data
                }
            });
        } else {
            Navigation.mergeOptions(this.props.componentId, {
                bottomTab: {
                    badge : isIos ? null : ''
                }
            });
        }
    }

    onClicked(){
        this.setBadge(-1)
    }

    onRefresh =()=>{
        this.setState({dataNotification:[]},()=>{this.getNotification()})
    }

    renderItem = ({item,index})=>{
        return(
            <ListNotification item={item} index={index} />
        )
        
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
                                <Text style={nbStyles.title}>Notifications</Text>
                                <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
                {this.state.dataNotification.length == 0 ?
                    this.renderNullList()
                :
                    <ListView data={this.state.dataNotification} propsVar={()=>this.onClicked()} />
                }
            </Container>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    Button: {
        backgroundColor: '#f5f5f5'

    }
})