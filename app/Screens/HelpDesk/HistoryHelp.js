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
import { DropdownInput, DateInput } from '../../components/Input';
import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import {Navigation} from 'react-native-navigation';
import OfflineNotice from '@Component/OfflineNotice';
import Title from "@Component/Title";
import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';


class HistoryHelp extends Component {
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

            email : '',
            debtor : '',
            group : '',
            typeTicket : "'C','R'",

            textDebtor : '',
            startDate : new Date(),
            endDate : new Date()
         };
    }

    async componentWillMount(){
        const data = {
            email : await _getData('@User'),
            group : await _getData('@Group'),
            debtor : await _getData('@Debtor'),
            textDebtor : await _getData('@Debtor'),
            dataTower : await _getData('@UserProject')
        } 

        this.setState(data,()=>{
            this.getDebtor()
        })
    }
    
    getDebtor = () => {

        const formData = {
            email : this.state.email,
        }

        fetch(urlApi+'c_ticket_history/getDebtorAll/IFCAPB',{
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

    getTicket = () => {
        const dT = this.state.dataTower[0]
        let endDate = this.state.endDate.getFullYear() + '/' + (this.state.endDate.getMonth() + 1) + '/'+ this.state.endDate.getDate()
        let startDate = this.state.startDate.getFullYear() + '/' + (this.state.startDate.getMonth() + 1) + '/'+ this.state.startDate.getDate()

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email,
            group : this.state.group,
            date_end : endDate,
            date_start : startDate,
            debtor : this.state.debtor,
            typeTicket : this.state.typeTicket,
            status : "'C','D'"
        }

        fetch(urlApi+'c_ticket_history/getDataTicketWhereStatus/'+dT.db_profile+'/'+formData.group,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                this.goToScreen(resData,'screen.ViewHistory')
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleChangeModal = (data) => {
        console.log('dataDeb', data)
        this.setState({
            debtor : data.debtor_acct,
            textDebtor:data.name
        })
    }

    handleIndexChange = (index) => {
        let typeTickets = index == 0 ? "'C','R'" : "'A'"

        this.setState({
            ...this.state,
            selectedIndex: index,
            typeTicket : typeTickets
        });

        console.log('Selected index', this.state.selectedIndex)
    }

    handleDateChange = (name, time) => {
        this.setState({ [name]: time });
    };

    goToScreen = (data,screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps : {
                    dataTicket :data
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
                        <Title text="History" />
                        <View style={nbStyles.subWrap2}>

                            <SegmentedControlTab
                                values={['Ticket']}
                                selectedIndex={this.state.selectedIndex}
                                onTabPress={this.handleIndexChange}
                                activeTabStyle={nbStyles.activeTabStyle}
                                activeTabTextStyle={nbStyles.activeTabTextStyle}
                                tabStyle={nbStyles.tabStyle}
                                tabTextStyle={nbStyles.tabTextStyle}
                            />
                        </View>
                        {/* <Text style={{ fontSize: 12, marginLeft: 12, marginTop: 16 }}>
                            Date: {this.state.chosenDate.toString().substr(4, 12)}
                        </Text>                     */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <DateInput
                                mode="date"
                                name="startDate"
                                label="Start Date"
                                format="DD MMMM YYYY"
                                min={new Date(2016,1,1)}
                                onChange={this.handleDateChange}
                                value={this.state.startDate}
                            />
                            <DateInput
                                mode="date"
                                name="endDate"
                                label="End Date"
                                format="DD MMMM YYYY"
                                min={new Date(2016,1,1)}
                                onChange={this.handleDateChange}
                                value={this.state.endDate}
                            />
                        </View>
                        <View style={nbStyles.subWrap}>
                            <DropdownInput
                                label="Debtor"
                                data={this.state.dataDebtor}
                                onChange={this.handleChangeModal}
                                value={this.state.textDebtor}
                            />
                        </View>
                        <View style={nbStyles.subWrap}>
                            <Button block style={Style.buttonSubmit} onPress={()=>this.getTicket()}>
                                <Text>View</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default HistoryHelp;
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

