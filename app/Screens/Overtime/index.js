import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {Container, 
    Content,
    Text,
    DatePicker,Button, Card
} from 'native-base'
import nbStyles from './Style'
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Swipeout from 'react-native-swipeout';
import OfflineNotice from '@Component/OfflineNotice';
import numFormat from '@Component/numFormat';
import moment from 'moment'

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';

class Overtime extends Component {
    _isMount = false;

    static options(passProps){
        return {
            topBar : {
                noBorder:true,
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
            loader : true,
            refresh : false,
            chosenDate: new Date(),

            email : '',
            token : '',

            dataTower : [],
            dataOvertime : [],

            selectedIndex : 0,
        };
        this.setDate = this.setDate.bind(this);
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate },()=>{
            this.getOvertime()            
        });
    }

    componentDidMount(){
        this._isMount = true;
    }

    componentWillUnmount(){
        this._isMount =false;
    }

    async componentDidAppear(){
        const datas =  {
            email : await _getData("@User"),
            token : await _getData("@Token"),
            dataTower : await _getData('@UserProject')
        }

        if(this._isMount){
            this.setState({selectedIndex : 0},()=>{
                this.loadData(datas)
            })
        }
    }

    loadData = (datas) => {
        this.setState(datas,()=>{
            this.getOvertime()
        })
    }
    getOvertime = () => {
        const dT = this.state.dataTower[0]
        const type = this.state.selectedIndex
        this.setState({dataOvertime:[],loader:true})

        const formData = {
            entity_cd : dT.entity_cd,
            project_no : dT.project_no,
            ov_date : this.state.chosenDate,
            status : type
        }
        fetch(urlApi+'c_overtime/getData/'+dT.db_profile,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log(res)
            if(this._isMount){
                if(res.Error === false){
                    let resData = res.Data;
                    this.setState({dataOvertime : resData,loader:false})
                } else {
                    this.setState({loader:false})
                }
            }

        }).catch((error) => {
            this.setState({loader:false})
            console.log(error);
        });
    }

    

    handleIndexChange = (index) => {
        this.setState({selectedIndex : index},()=>{
            this.getOvertime()
        });
    }

    handleOptionOT = (data)=>{
        data.status !== 'Y' ?
        Alert.alert(
        'Alert', data.ot_id,
        [
            { text: 'Delete', onPress: () => console.log('user delete') },
            { text: 'Edit', onPress:()=>console.log('user edit')},
            { text: 'Cancel', onPress:()=>console.log('user cancel'),style:'cancel'}
        ],
        { cancelable: true },
        )
        :
        console.log('response Handle')
    }


    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps :{
                    chosenDate : this.state.chosenDate,
                    dataLot : this.state.dataLot,
                    dataTower : this.state.dataTower
                }
            }
        })
    }

    renderLoader(){
        return(
            <View style={nbStyles.nullList}>
                <ActivityIndicator size='large' color="#37BEB7"/>
            </View>
        )
    }

    renderNullList(){
        return(
            <View style={nbStyles.nullList}>
                <Text style={nbStyles.title}>Data Not Available</Text>
            </View>
        )
    }

    render() {
        
        return (
           <Container>
               <OfflineNotice/>
                <Content>
                    <View style={nbStyles.rowWrap}>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={nbStyles.title}>Overtime</Text>
                        </View>
                        <TouchableOpacity transparent style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}} onPress={()=>this.goToScreen('screen.AddOvertime')}>
                            <Icon name="plus" style={nbStyles.icon}></Icon>
                            <Text style={{fontSize:20,fontWeight:'bold',color:'#333'}}> Add New</Text>
                        </TouchableOpacity>
                    </View>      
                          
                        {/* <Text style={{fontSize:12, marginLeft: 12, marginTop: 16}}>
                            Date: {this.state.chosenDate.toString().substr(4, 12)}
                        </Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View style={{marginTop:16}}>
                                <DatePicker
                                    defaultDate={new Date()}
                                    minimumDate={new Date()}
                                    // maximumDate={new Date(2019, 12, 31)}
                                    locale={"id"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select date and time"
                                    textStyle={{ color: "green" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={this.setDate}
                                    disabled={false}
                                />
                            </View>
                            <Button small style={{color: "#37BEB7", padding: 20, marginRight: 16, marginTop: 16}}
                                onPress={()=>this.goToScreen('screen.AddOvertime')}  >
                                <Text> Add New</Text>
                            </Button>
                        </View> */}
                        <View style={nbStyles.subWrap}>
                            <SegmentedControlTab
                            values={['Open', 'Approve', 'History']}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}
                            activeTabStyle={nbStyles.activeTabStyle}
                            activeTabTextStyle={nbStyles.activeTabTextStyle}
                            tabStyle={nbStyles.tabStyle}
                            tabTextStyle={nbStyles.tabTextStyle}
                            />        
                        </View>
                            <View style={styles.listview}>
                            {this.state.loader ? 
                                this.renderLoader()
                                :
                                this.state.dataOvertime.length == 0 ?
                                    this.renderNullList() :

                                    this.state.dataOvertime.map((data,key)=>
                                    <TouchableWithoutFeedback key={key} onPress={()=>this.handleOptionOT(data)}>
                                    <Card style={{
                                        height:null,
                                        backgroundColor: 'white',
                                        shadowOffset : { width:1, height: 1},
                                        shadowColor:"#37BEB7",
                                        shadowOpacity:0.5,
                                        elevation:5,
                                        paddingHorizontal:10,
                                        paddingVertical:10,
                                        // marginVertical:0
                                        }}>
                                        <View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text style={{
                                                    fontSize: 18,
                                                    fontWeight:'500',
                                                    textAlign:'left'
                                                }}>
                                                    {data.lot_no}
                                                </Text>
                                                {data.approved == "N" ?
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight:'500',
                                                    textAlign:'right',
                                                    color:'#9B9B9B'
                                                }}>
                                                    Start : {data.start_overtime.toString().substr(11, 5)}
                                                </Text>:
                                                 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        fontWeight:'300',
                                                        textAlign:'left',
                                                        color:'#9B9B9B'
                                                    }}>
                                                        {moment(data.start_overtime).format('DD MM YYYY')}
                                                    </Text>
                                                </View>
                                            
                                            }
                                            </View>
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text style={{
                                                    fontSize: 16,
                                                    fontWeight:'500',
                                                    textAlign:'left',
                                                    color:'#F99B23'
                                                }}>
                                                    {data.name_debtor}
                                                </Text>
                                                {data.approved == "N" ?
                                                <View>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight:'500',
                                                    textAlign:'right',
                                                    color:'#9B9B9B'
                                                }}>
                                                   End : {data.end_overtime.toString().substr(11, 5)}
                                                </Text>
                                            </View>:null}
                                            </View>
                                            
                                            {data.approved == "Y" ?
                                            <View>
                                                
                                                <View style={{width:'100%',height:0.5,backgroundColor:'#333',marginVertical:5}}></View>       
                                                <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                                                    <Text style={styles.count}>{data.end_overtime.toString().substr(11, 5)}</Text>
                                                    <Text style={styles.op}> - </Text>
                                                    <Text style={styles.count}>{data.start_overtime.toString().substr(11, 5)}</Text>
                                                    <Text style={styles.op}> = </Text>
                                                    <Text style={styles.count}>{numFormat(data.usage)}</Text>
                                                    <Text style={styles.op}> x </Text>
                                                    <Text style={styles.count}>Rp. {numFormat(data.rate)}</Text>
                                                    <Text style={styles.op}> = </Text>
                                                    <Text style={styles.count}>Rp. {numFormat(data.trx_amt)}</Text>
                                                </View>         
                                            </View>
                                            :
                                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight:'300',
                                                    textAlign:'left',
                                                    color:'#9B9B9B'
                                                }}>
                                                    Overtime Date : {data.start_overtime.toString().substr(0, 10)}
                                                </Text>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight:'bold',
                                                    textAlign:'right',
                                                    color:'#333'
                                                }}>Rp. {numFormat(data.trx_amt)}</Text>
                                            </View>
                                            }                       
                                            
                                        </View>
                                    </Card>    
                                    </TouchableWithoutFeedback>
                                    
                                )

                            }
                            

                        </View>
               </Content>
           </Container>
        );
    }
}
export default Overtime;

const styles = StyleSheet.create({
    listview: {
        marginTop: 10,
        paddingVertical : 5
    },
    listitemm: {
        height: 100
    },
    count : {
        fontSize: 14,
        fontWeight:'300',
        textAlign:'left',
    },
    op :{
        fontSize: 14,
        fontWeight:'700',
        color:'#F99B23',
        textAlign:'left',
    }
});
