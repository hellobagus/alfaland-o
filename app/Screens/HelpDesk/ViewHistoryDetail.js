import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Container, Content, Card } from "native-base";
import nbStyles from './Style'
import Style from '@Theme/Style'
import OfflineNotice from '@Component/OfflineNotice';
import numFormat from '@Component/numFormat';
import ModalSelector from 'react-native-modal-selector'
import {Navigation} from 'react-native-navigation'

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';

const dataPayment = [
    {
        type : 'C',
        descs : 'Cash',
    },
    {
        type : 'S',
        descs : 'Schedule'
    }
]

class ViewHistoryDetail extends Component {
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
            isLoaded : true,
            email : '',
            name : '',
            dataTicket : [],
            billAmt : 0,
            item : [],
            service : [],
            showAmount : false ,
            subTotalItem : 0,
            subTotalService : 0,
            selectedPayment : {
                type:'C',
                descs : 'Cash'
            }
        }
    }

    async componentDidMount(){
        const email = await _getData('@User')
        const name = await _getData('@Name')
        const dataTicket = this.props.dataTicket
        this.setState({email : email,name : name},()=>{
            this.getTicketDetail(dataTicket)

            if(dataTicket.status == "S"){
                this.getTicketBilling(dataTicket)
            }
        })
        
    }

    getTicketDetail = (data) => {
        const formData = {
            entity : data.entity_cd,
            project : data.project_no,
            complain_no : data.complain_no
        }

        fetch(urlApi+'c_ticket_history/getDataTickMulti/IFCAPB/DEBTOR',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log('res',res);
            if(res.Error === false){
                let resData = res.Data[0];
                this.setState({dataTicket:resData},()=>{
                    console.log('data',this.state.dataTicket);
                })
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    getTicketBilling  = (data) => {
        const formData = {
            entity : data.entity_cd,
            project : data.project_no,
        }

        fetch(urlApi+'c_ticket_history/getTicketBilling/IFCAPB/'+data.report_no,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log('resBiling',res);
            if(res.Data > 0){
                this.setState({showAmount : true,billAmt:res.Data},()=>{
                    this.getTicketIaS(data)
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTicketIaS = (data) =>{
        const formData = {
            entity : data.entity_cd,
            project : data.project_no,
        }

        fetch(urlApi+'c_ticket_history/getTicketIaS/IFCAPB/'+data.report_no,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log('resBiling',res);
            if(!res.Error){
                let subTotalItems = {total_amt:0}
                let subTotalServices = {total_amt:0}
                if(res.item.length !==0){
                    subTotalItems = res.item.reduce((a,b)=>{ return {total_amt : parseFloat(a.total_amt)+parseFloat(b.total_amt)}})
                }
                if(res.service.length !==0){
                    subTotalServices = res.service.reduce((a,b)=>{ return {total_amt : parseFloat(a.total_amt)+parseFloat(b.total_amt)}})
                }
                this.setState({item : res.item,service:res.service,subTotalItem:subTotalItems,subTotalService:subTotalServices},()=>{
                    console.log('item',this.state);
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    saveConfirm = () =>{
        const data = this.props.dataTicket
        const formData = {
            entity : data.entity_cd,
            project : data.project_no,
            complainno : data.complain_no,
            name : this.state.name,
            email : this.state.email,
            assignto : data.assign_to,
            payment_method : this.state.selectedPayment.type

        }
        console.log('dataTicket',formData);


        fetch(urlApi+'c_ticket_history/saveConfirm/IFCAPB/',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log('saveConfirm',res);
            this.showAlert(res.Pesan)
        }).catch((error) => {
            console.log(error);
        });
    }

    showAlert(data) {
        Alert.alert(
        'Notification', data,
        [
            { text: 'OK', onPress: () => Navigation.popToRoot(this.props.componentId) }
        ],
        { cancelable: false },
        );
    }
    

    render() {
        console.log('datas', this.state.dataTicket)
        
        
        const deviceWidth = Dimensions.get('window').width;
        const data = this.state.dataTicket;
        const wrapStyle = {
            justifyContent:'space-between',flexDirection:'row',
            marginVertical : 10
        }
        const widthStyle = {
            width : ( deviceWidth * 2 / 5)
        }
        const rowStyle = {
            flexDirection: 'row',
            justifyContent:'space-between',
        }
        const rowStyleTopBordered = {
            flexDirection: 'row',
            justifyContent:'space-between',
            borderTopWidth: 0.5,
        }

        const rowItem = {
            flexWrap: 'wrap',
            width : '33%'
        }

        const title = {
            fontSize: 18,
            fontWeight: 'bold',
        }

        const btnConfirm = {
            width : '100%',
            paddingVertical: 10,
            alignItems: 'center',
            backgroundColor: '#F9A233',
        }

        const borderBottomColor ={
            borderWidth:1,
            borderBottomColor:'#f3f3f3',
            borderTopColor:'transparent',
            borderRightColor:'transparent',
            borderLeftColor:'transparent',
        }
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    
                    {data.length !== 0 ?
                    <Card>

                    <View style={{margin:5}}>
                        <View style={borderBottomColor}>
                            <Text>Status</Text>
                            <Text>{
                            data.status == "R" ? "Open":
                            data.status == "A" ? "Assign":
                            data.status == "S" ? "Need Confirmation":
                            data.status == "P" ? "Procces":
                            data.status == "F" ? "Confirm":
                            data.status == "V" ? "Solve":
                            data.status == "C" ? "Completed":
                            data.status == "D" ? "Done" :
                            ""
                            }</Text>
                        </View>
                        <View style={borderBottomColor}>
                            <View style={wrapStyle}>
                                <View style={widthStyle}>
                                    <Text>Reported Date :</Text>
                                    <Text>{data.reported_date}</Text>
                                </View>
                                <View style={widthStyle}>
                                    <Text>Serve by :</Text>
                                    <Text>{data.serv_req_by}</Text>
                                </View>
                            </View>
                            <View style={wrapStyle}>
                                <View style={widthStyle}>
                                    <Text>Lot no :</Text>
                                    <Text>{data.lot_no}</Text>
                                </View>
                                <View style={widthStyle}>
                                    <Text>Complain Type :</Text>
                                    <Text>{data.complain_type == "C" ? "Complain" : "Request"}</Text>
                                </View>
                            </View>
                           
                            <View style={wrapStyle}>
                                <View style={widthStyle}>
                                    <Text>Category :</Text>
                                    <Text>{data.descs}</Text>
                                </View>
                                <View style={widthStyle}>
                                    <Text>Description :</Text>
                                    <Text>{data.work_requested}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={borderBottomColor}>
                            <Text>No Complain :</Text>
                            <Text># {data.complain_no}</Text>
                        </View>
                    </View>
                    {
                        data.status=="S" ?
                        <View style={{margin:5}}>
                            {this.state.billAmt > 0 ?
                                <View>
                                    <View style={{width:'100%'}}>
                                        <Text>Billing Amount : {numFormat(this.state.billAmt)}</Text>
                                        <Text>Calculation work Order</Text>
                                        <View style={{marginVertical:5}}>
                                            <Text style={title}>Item</Text>
                                            {this.state.item.length > 0 ? 
                                                <View>
                                                    {this.state.item.map((item,key)=>
                                                        <View style={rowStyle} key={key}>
                                                            <Text style={{flexWrap:'wrap',width:'70%'}}>{item.descs_item}</Text>
                                                            <Text style={{width:'10%',textAlign:'right'}}>{numFormat(item.qty)}</Text>
                                                            <Text style={{width:'20%',textAlign:'right'}}>{numFormat(item.total_amt)}</Text>
                                                        </View>
                                                    )}
                                                    <View style={rowStyleTopBordered}>
                                                        <Text>Total</Text>
                                                        <Text>{numFormat(this.state.subTotalItem.total_amt)}</Text>
                                                    </View>
                                                </View>
                                            :<Text>No Item</Text>}
                                        </View>
                                        <View style={{marginVertical:5}}>
                                            <Text style={title}>Service</Text>
                                            {this.state.service.length > 0 ? 
                                                <View>
                                                    {this.state.service.map((service,key)=>
                                                        <View style={rowStyle} key={key}>
                                                            <Text style={{flexWrap:'wrap',width:'70%'}}>{service.descs_service}</Text>
                                                            <Text style={{width:'30%',textAlign:'right'}}>{numFormat(service.total_amt)}</Text>
                                                        </View>
                                                    )}
                                                    <View style={rowStyleTopBordered}>
                                                        <Text>Total</Text>
                                                        <Text>{numFormat(this.state.subTotalService.total_amt)}</Text>
                                                    </View>
                                                </View>
                                            :<Text>No Service</Text>}
                                        </View>
                                    </View>
                                    <Text>Payment Method</Text>
                                    <ModalSelector
                                        data={dataPayment}
                                        optionTextStyle={{color:"#333"}}
                                        selectedItemTextStyle={{color:'#3C85F1'}}
                                        accessible={true}
                                        keyExtractor= {item => item.type}
                                        labelExtractor= {item => item.descs}
                                        // scrollViewAccessibilityLabel={'Scrollable options'}
                                        cancelButtonAccessibilityLabel={'Cancel Button'}
                                        onChange={(option)=>{ this.setState({selectedPayment : option})}}>
                                        <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                            editable={false}
                                            placeholderTextColor='#a9a9a9'
                                            value={this.state.selectedPayment.descs}
                                        />
                                    </ModalSelector>
                                </View>
                            :null}
                            
                            <TouchableOpacity style={btnConfirm} onPress={()=>this.saveConfirm()}>
                                <Text>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    </Card>
                    :
                    <ActivityIndicator />
                    }

                </Content>
            </Container>
        );
    }
}
export default ViewHistoryDetail;

const styles = StyleSheet.create({

    input :{
        height: 40,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
