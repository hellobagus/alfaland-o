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
import Title from "@Component/Title";
import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import {Navigation} from 'react-native-navigation';
import OfflineNotice from '@Component/OfflineNotice';
import { DropdownInput, DateInput } from '../../components/Input';
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
            startDate : new Date(),
            endDate : new Date()
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

    handleDateChange = (name, time) => {
        this.setState({ [name]: time });
    };

    handleChangeModal = (data) => {
        console.log('dataDeb', data)
        this.setState({
            debtor : data.debtor_acct,
            textDebtor:data.name,

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
                        <Title text="Statement of Account" />
                        <Text style={{ fontSize: 12, marginLeft: 12, marginTop: 16 }}>
                            Date: {this.state.chosenDate.toString().substr(4, 12)}
                        </Text>
                        <View style={nbStyles.subWrap}>
                            <DropdownInput
                                label="Project"
                                data={this.state.dataTower}
                                onChange={this.handleChangeProject}
                                value={this.state.selProject.project_descs}
                            />
                        </View>
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

