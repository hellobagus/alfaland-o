import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    TextInput,
    AsyncStorage
} from "react-native";
import {
    Container,
    Content,
    Text,
    DatePicker, Button
} from 'native-base'
import nbStyles from './Style'
import ModalSelector from 'react-native-modal-selector'

import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import {Navigation} from 'react-native-navigation';
import OfflineNotice from '@Component/OfflineNotice';

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';


class SoaSearch extends Component {
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
            chosenDate: new Date(),
            dataDebtor : [],
            dataTower : [],
            
            selProject : [],

            email : '',
            debtor : '',
            group : '',
            typeTicket : "'C','R'",

            textDebtor : '',
            textProject : '',
            startDate : new Date(2018,10,10),
            endDate : new Date(2019, 2, 1)
         };
    }

    async componentWillMount(){
        const data = {
            email : await _getData('@User'),
            group : await _getData('@Group'),
            dataTower : await _getData('@UserProject')
        } 

        this.setState(data)
    }
    
    getDebtor = (data) => {

        const formData = {
            email : this.state.email,
        }

        fetch(urlApi+'c_ticket_history/getDebtorAll/'+data.db_profile,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                
                this.setState({dataDebtor : resData})
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleChangeProject = (data) => {
        console.log('dataProject', data)
        this.setState({
            selProject:data,
        },()=>{
            this.getDebtor(data)
        })
    }

    handleChangeModal = (data) => {
        console.log('dataDeb', data)
        this.setState({
            debtor : data,
            textDebtor:data.name
        })
    }

    handleNavigation(){
        const data = {
            selProject : this.state.selProject,
            startDate : this.state.startDate,
            endDate : this.state.endDate,
            debtor : this.state.debtor
        }

        this.goToScreen(data,'screen.SoaList')
    }

    goToScreen = (data,screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps : {
                    items :data
                }
            }
        })
    }

    render() {
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap}>
                        <View style={nbStyles.subWrap}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <Text style={nbStyles.title}>Statement of Account</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 12, marginLeft: 12, marginTop: 16 }}>
                            Date: {this.state.chosenDate.toString().substr(4, 12)}
                        </Text>
                        <View style={nbStyles.subWrap}>
                            <View>
                                <ModalSelector
                                    data={this.state.dataTower}
                                    accessible={true}
                                    keyExtractor= {item => item.project_no}
                                    labelExtractor= {item => item.project_descs}
                                    optionTextStyle={{color:"#333"}}
                                    selectedItemTextStyle={{color:'#3C85F1'}}
                                    def
                                    // scrollViewAccessibilityLabel={'Scrollable options'}
                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                    onChange={(option)=>{ this.handleChangeProject(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Project"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.selProject.project_descs}
                                    />
                                </ModalSelector>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={[styles.input,{marginBottom : 0}]}>
                                <DatePicker
                                    locale={"id"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={true}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select date"
                                    textStyle={{ color: "green" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={(val)=>this.setState({startDate : val})}
                                    disabled={false}
                                />
                                
                            </View>
                            <View style={[styles.input,{marginBottom : 0}]}>
                                <DatePicker
                                    defaultDate={new Date()}
                                    locale={"id"}
                                    timeZoneOffsetInMinutes={undefined}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select date"
                                    textStyle={{ color: "green" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={(val)=>this.setState({endDate : val})}
                                    disabled={false}
                                />
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>

                            <View>
                                <ModalSelector
                                    data={this.state.dataDebtor}
                                    accessible={true}
                                    keyExtractor= {item => item.debtor_acct}
                                    labelExtractor= {item => item.name}
                                    optionTextStyle={{color:"#333"}}
                                    selectedItemTextStyle={{color:'#3C85F1'}}
                                    def
                                    // scrollViewAccessibilityLabel={'Scrollable options'}
                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                    onChange={(option)=>{ this.handleChangeModal(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Debtor"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.textDebtor}
                                    />
                                </ModalSelector>
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <Button block style={Style.buttonSubmit} onPress={()=>this.handleNavigation()}>
                                <Text>View</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default SoaSearch;
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
    inputs :{
        height: 80,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
    }
})

