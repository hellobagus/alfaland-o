import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,PixelRatio
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
    Container,
    Content,
    Text,
    DatePicker, 
    Title, Button,  Right, Body, Left, Picker, Form, Header
} from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment'
import nbStyles from './Style'
import Style from '@Theme/Style'
import ModalSelector from 'react-native-modal-selector'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { Navigation } from "react-native-navigation";
import OfflineNotice from '@Component/OfflineNotice';
import Icon from 'react-native-vector-icons/FontAwesome'
import numFormat from '@Component/numFormat'
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';
class AddOvertime extends Component {
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

    constructor(props) {
        super(props);
        this.state = { 
            chosenDate : props.chosenDate,
            dataTower : props.dataTower,
            dataLot : [],
            dataDebtor: [],
            dataOverType : [],
            email : '',

            selectedTower : {
                dbProfile : props.dataTower[0].db_profile,
                entity : props.dataTower[0].entity_cd,
                project : props.dataTower[0].project_no,
                project_descs : props.dataTower[0].project_descs
            },

            selectedOvType : {
                over_cd : '',
                descs : ''
            },
            textDebtor :'',
            textLot : '',
            levelNo : '',
            debtorAcct : '',
            descsLevel : '',
            total : '',
            rate : 0,
            isVisible: false,
            startVisible:false,
            endVisible : false,
            dateVisible : false,

            startTime : '',
            endTime : 1,

            isLoading : false
        };

        console.log('props', props)
        
        this.setDate = this.setDate.bind(this);
    }

    async componentDidMount(){
        this._isMount =true

        const datas =  {
            email : await _getData("@User"),
        }

        this.setState(datas,()=>{
            this.getLot()
            this.getDebtor()
            this.getStartTime()
            this.getOverType()
        })
    }

    componentWillUnmount(){
        this._isMount = false
    }

    getLot = () => {
        const dT = this.state.selectedTower

        const formData = {
            entity_cd : dT.entity,
            project_no : dT.project
        }

        fetch(urlApi+'c_overtime/zoom_lot_no/'+dT.dbProfile,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data;
                if(this._isMount){
                    this.setState({dataLot : resData})
                }
                
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    getDebtor = () => {
        const dT = this.state.selectedTower

        const formData = {
            entity : dT.entity,
            project : dT.project,
            email : this.state.email,
        }
        fetch(urlApi+'c_ticket_entry/getDebtor/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                if(this._isMount){
                    this.setState({dataDebtor : resData})
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getOverType = () => {
        const dT = this.state.selectedTower

        const formData = {
            entity_cd : dT.entity,
            project_no : dT.project,
        }
        fetch(urlApi+'c_overtime/zoom_over/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                if(this._isMount){
                    this.setState({dataOverType : resData})
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getStartTime = () => {
        const dT = this.state.selectedTower

        const formData = {
            entity_cd : dT.entity,
            project_no : dT.project,
            StartDate : this.state.chosenDate,
        }
        fetch(urlApi+'c_overtime/addStart/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data[0]
                if(this._isMount){
                    this.setState({startTime : resData.ov_start})
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTrxRate = () =>{
        const dT = this.state.selectedTower

        const formData = {
            entity_cd : dT.entity,
            project_no : dT.project,
            over_cd : this.state.selectedOvType.over_cd,
        }
         fetch(urlApi+'c_overtime/zoom_rate/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                let rates = parseFloat(resData.rate)
                let usage = parseFloat(this.state.endTime)
                let result = rates * usage

                this.setState({total:result, rate: rates})
                console.log('Trx Rate',result);

            }
        }).catch((error) => {
            console.log(error);
        });
    }

    saveOvertime = async()=>{
        this.setState({isLoading : true})
        const dataTower = this.state.selectedTower
        const {textLot,debtorAcct,levelNo,descsLevel,startTime,endTime,chosenDate,total} = this.state

        const formData = {
            business_id : await _getData('@UserId'),
            entity : dataTower.entity,
            project_no : dataTower.project,
            ot_Id : 0,
            lotno : textLot + '-%-' + debtorAcct + '-%-' + levelNo + '-%-' + descsLevel,
            descs : 'Overtime ',
            ov_date : chosenDate,
            startHour : moment(startTime).format('HH:mm:ss'),
            // endHour : endTime+':00',
            usage : endTime,
            trx_amt : total
        }

        console.log('formData', formData)

        fetch(urlApi+'c_overtime/save/'+dataTower.dbProfile,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            this.setState({isLoading : false},()=>{
                this.showAlert(res.Pesan,res.Error)
            })     
        }).catch((error) => {
            console.log(error);
            this.setState({isLoading : false},()=>{
                this.showAlert('error',true)
            })    
        });
    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    handleUsage = (type)=>{
        let usage = this.state.endTime 
        let rates = this.state.rate

        if(this.state.selectedOvType.over_cd !== ''){
            if(type=="plus"){
                this.setState({endTime : usage + 0.5},()=>{
                    let after = parseFloat(this.state.endTime)
                    let res = after * rates
                    this.setState({total:res})
                })
            } else if(type=="min"){
                if(this.state.endTime > 1) {
                    this.setState({endTime : usage - 0.5},()=>{
                        let after = parseFloat(this.state.endTime)
                        let res = after * rates
                        this.setState({total:res})
                    })
                }
            }
        } else {
            alert('Please choose over type')
        }
    }

    handleProjectChange =(tower) => {
        this.setState({
            selectedTower :{
                entity : tower.entity_cd,
                project : tower.project_no,
                project_descs : tower.project_descs,
                dbProfile : tower.db_profile
            }
        },()=>{
            this.getLot()
        })
    }

    handleOvTypeChange =(type) => {
        this.setState({
            selectedOvType :{
                over_cd : type.over_cd,
                descs : type.descs,
            }
        },()=>{
            this.getTrxRate()
        })
    }

    handleDebtorChange =(debtor) => {
        this.setState({
            textDebtor : debtor.name,
            debtorAcct : debtor.debtor_acct,
        })
    }

    handleLotChange =(lot) => {
        this.setState({
            textLot : lot.lot_no,
            levelNo : lot.level_no,
            descsLevel : lot.descs_level
        })
    }

    handleIndexChange = (index) => {
        this.setState({
            ...this.state,
            selectedIndex: index,
        });

        console.log('Selected index', this.state.selectedIndex)
    }

    showPicker = (data) => data == 'startTime' ? this.setState({ startVisible: true }) : data == 'date' ? this.setState({ dateVisible: true }) : this.setState({ endVisible: true });
 
    hidePicker = (data) => data == 'startTime' ? this.setState({ startVisible: false }) : data == 'date' ? this.setState({ dateVisible: false }) : this.setState({ endVisible: false });
    
    handlePicker = (type,time) => {
        type == 'startTime' 
        ?
        this.setState({
            startVisible : false,
            startTime : moment(time).format('HH:mm')
        })
        :
        type == 'date' 
        ?
        this.setState({
            dateVisible : false,
            chosenDate : time
        },()=>{
            this.getStartTime()
        })
        :
        this.setState({
            endVisible : false,
            endTime : moment(time).format('HH:mm')
        })

    };

    showAlert(data,errorkah) {
        Alert.alert(
        'Alert', data,
        [
            { text: 'OK', onPress: () => !errorkah ? Navigation.pop(this.props.componentId) : console.log('error')}
        ],
        { cancelable: false },
        );
    }

    render() {
        
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap} pointerEvents={this.state.isLoading ? 'none' : 'auto'}>
                        <View style={nbStyles.subWrap}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={nbStyles.title}>Add Overtime</Text>
                            </View>
                        </View>
                        
                        <View style={[nbStyles.subWrap,{marginTop:10}]}>



                            <View style={nbStyles.subWrap}>
                            <Text>Select Project</Text>
                                <ModalSelector
                                    data={this.state.dataTower}
                                    optionTextStyle={{color:"#333"}}
                                    selectedItemTextStyle={{color:'#3C85F1'}}
                                    accessible={true}
                                    keyExtractor= {item => item.project_no}
                                    labelExtractor= {item => item.project_descs}
                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                    onChange={(option)=>{ this.handleProjectChange(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Project"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.selectedTower.project_descs}
                                    />
                                </ModalSelector>
                            </View>

                            <View style={nbStyles.subWrap}>

                            {/*  Date  */}
                                <Text>Overtime Date</Text>
                                <TouchableOpacity onPress={()=>this.showPicker('date')}>
                                    <View pointerEvents='none'>
                                        <TextInput style={styles.inputDate} 
                                        placeholder="Select Date"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={moment(this.state.chosenDate).format('dddd, DD MMMM YYYY')}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <DateTimePicker
                                mode = {'date'}
                                is24Hour={true}
                                date={this.state.chosenDate}
                                isVisible={this.state.dateVisible}
                                minimumDate ={new Date()}
                                onConfirm={(val)=>{this.handlePicker('date',val)}}
                                onCancel={()=>this.hidePicker('date')}
                                />
                            </View>

                            <View style={nbStyles.subWrap}>
                            <Text>Select Debtor</Text>
                                <ModalSelector
                                data={this.state.dataDebtor}
                                optionTextStyle={{color:"#333"}}
                                selectedItemTextStyle={{color:'#3C85F1'}}
                                accessible={true}
                                keyExtractor= {item => item.debtor_acct}
                                labelExtractor= {item => item.name}
                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                onChange={(option)=>{ this.handleDebtorChange(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Debtor"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.textDebtor}
                                    />
                                </ModalSelector>
                            </View>

                            <View style={nbStyles.subWrap}>
                            <Text>Select Lot No</Text>
                                <ModalSelector
                                data={this.state.dataLot}
                                optionTextStyle={{color:"#333"}}
                                selectedItemTextStyle={{color:'#3C85F1'}}
                                accessible={true}
                                keyExtractor= {item => item.lot_no}
                                labelExtractor= {item => item.lot_no}
                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                onChange={(option)=>{ this.handleLotChange(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Lot No"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.textLot}
                                    />
                                </ModalSelector>
                            </View>

                            <View style={nbStyles.subWrap}>
                            <Text>Select Over Type</Text>
                                <ModalSelector
                                data={this.state.dataOverType}
                                optionTextStyle={{color:"#333"}}
                                selectedItemTextStyle={{color:'#3C85F1'}}
                                accessible={true}
                                keyExtractor= {item => item.over_cd}
                                labelExtractor= {item => item.descs}
                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                onChange={(option)=>{ this.handleOvTypeChange(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Over Type"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.selectedOvType.descs}
                                    />
                                </ModalSelector>
                            </View>
                            
                            {/* Time */}
                            <View style={nbStyles.subWrap}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ marginTop: 10 }}>
                                        <View style={{alignItems:'center'}}>
                                            <Text>Start Hour</Text>                                            
                                            <View pointerEvents='none'>
                                                <TextInput style={styles.inputTime} 
                                                    placeholder="Start Hour"
                                                    editable={false}
                                                    placeholderTextColor='#a9a9a9'
                                                    value={moment(this.state.startTime).format('HH:mm')}
                                                />
                                            </View>
                                        </View>
                                        {/* <DateTimePicker
                                            mode = {'time'}
                                            is24Hour={true}
                                            date={new Date("December 25, 1995 "+this.state.startTime)}
                                            isVisible={this.state.startVisible}
                                            onConfirm={(val)=>{this.handlePicker('startTime',val)}}
                                            onCancel={()=>this.hidePicker('startTime')}
                                            datePickerModeAndroid={'spinner'}
                                        /> */}
                                    </View>
                                    <View style={{ marginTop: 10, alignItems:'flex-end' }}>
                                        <View style={{alignItems:'center'}}  onPress={this.showPicker}>
                                            <Text>Usage</Text>
                                            <View style={{flexDirection:'row'}}>
                                                <TouchableOpacity style={[styles.inputUsage,styles.btnMin]} onPress={()=>this.handleUsage("min")}>
                                                    <Icon name="minus" />
                                                </TouchableOpacity>
                                                {/* <TextInput style={styles.inputTime} 
                                                placeholder="End Hour"
                                                editable={false}
                                                placeholderTextColor='#a9a9a9'
                                                value={this.state.endTime}
                                                /> */}
                                                <View style={[styles.inputUsage,{backgroundColor: '#f5f5f5',width:deviceWidth * 0.28,}]} >
                                                    <Text>{this.state.endTime}</Text>
                                                </View>

                                                <TouchableOpacity style={[styles.inputUsage,styles.btnPlus]} onPress={()=>this.handleUsage("plus")}>
                                                    <Icon name="plus" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {/* <DateTimePicker
                                            mode = {'time'}
                                            // is24Hour={true}
                                            date={new Date("December 25, 1995 "+this.state.endTime)}
                                            isVisible={this.state.endVisible}
                                            onConfirm={(val)=>{this.handlePicker('endTime',val)}}
                                            onCancel={()=>this.hidePicker('endTime')}
                                            datePickerModeAndroid={'spinner'}
                                        /> */}
                                    </View>
                                </View>
                            </View>
                            <View style={nbStyles.subWrap}>
                                <Text>Total</Text>
                                <TextInput style={styles.input} 
                                    placeholder="Total"
                                    editable={false}
                                    placeholderTextColor='#a9a9a9'
                                    value={numFormat(this.state.total)}
                                />
                            </View>
                            <View style={nbStyles.subWrap}>
                                <Button block style={Style.buttonSubmit} onPress={()=>this.saveOvertime()}>
                                    {this.state.isLoading === false ?
                                        <Text>SUBMIT</Text>
                                    :
                                        <View style={nbStyles.btnLoadingWrap}>
                                            <ActivityIndicator size="small" color="#fff"/>
                                            <Text>Loading...</Text>
                                        </View>
                                    }
                                    
                                </Button>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default AddOvertime;


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

    inputTime :{
        height: 40,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: deviceWidth * 0.4,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign : 'center'
    },
    inputUsage :{
        height: 40,
        color:"black",
        marginBottom: 16,
        // borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign : 'center'
    },
    inputDate :{
        height: 40,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign : 'left'
    },
    btnMin :{
        borderBottomLeftRadius : 10,
        borderTopLeftRadius: 10,
        backgroundColor: '#f1f1f1',
        width: deviceWidth * 0.08,
    },
    btnPlus :{
        borderBottomRightRadius : 10,
        borderTopRightRadius: 10,
        backgroundColor: '#f1f1f1',
        width: deviceWidth * 0.08,
    },
})