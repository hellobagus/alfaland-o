import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Picker,
    AsyncStorage
} from "react-native";
import nbStyles from './Style'
import Style from '@Theme/Style'
import {Accordion, Container, Content,Icon} from 'native-base';
// import {Icon} from 'react-native-elements'
import ModalSelector from 'react-native-modal-selector'
import OfflineNotice from '@Component/OfflineNotice';
import ReactNativePickerModule from 'react-native-picker-module'
 
import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config';

const dataGender = [
    "Male",
    "Femele"
]

class EditProfile extends Component {
    static options(passProps){
        return {
            topBar : {
                noBorder :true,
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
            selectedIndexGender : 0,
       
            oldName : props.passed.name,

            email : props.passed.email,
            name : props.passed.name,
            hp : props.passed.Handphone,
            gender : props.passed.gender,

        }

        console.log(props)
        this.renderAccordionHeader = this.renderAccordionHeader.bind(this)
        this.renderAccordionContent = this.renderAccordionContent.bind(this)
        this.renderAccordionContentProfile = this.renderAccordionContentProfile.bind(this)
        this.renderAccordionContentPassword = this.renderAccordionContentPassword.bind(this)
    }

    componentDidMount(){
        this.props.passed.gender == "Male" ? 
        this.setState({selectedIndexGender:0}) :
        this.setState({selectedIndexGender:1})
    }

    handleGenderChange = (data)=>{
        if(data==0){
            this.setState({selectedIndexGender:data,gender :"Male" })
        } else if(data==1){
            this.setState({selectedIndexGender:data,gender :"Femele" })
        }
    }

    save = () => {
        const dt = this.state

        const formData = {
            UserName : dt.email,
            Name : dt.name,
            Handphone : dt.hp,
            Gender : dt.gender,
            wherename : dt.oldName,

        }
        console.log(formData)

        fetch(urlApi+'c_profil/save/',{
            method : "POST",
            body :JSON.stringify(formData),
            headers :{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token' : this.props.token
            }
        })
        .then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                alert(res.Pesan)
                this.refreshData();
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    refreshData = async() =>{
        _storeData('@RefreshProfile', true);
    }

    renderAccordionHeader(item, expanded) {
        return (
            <View style={nbStyles.accordionTab}>
                <Text style={nbStyles.accordionTabText}>
                    {" "}{item.title}
                </Text>
                {expanded
                    ? <Icon style={nbStyles.accordionTabIcon} name="minus" type="Foundation" />
                    : <Icon style={nbStyles.accordionTabIcon} name="plus" type="Foundation" />}
            </View>
        );
    }

    renderAccordionContent(item) {
        var fn = 'renderAccordionContent' + (item.type.charAt(0).toUpperCase() + item.type.substr(1));
        return <View style={nbStyles.accordionContent}>
           {this[fn]()}
        </View>
    }

    renderAccordionContentProfile(){
        const data = this.state;
        return <View>

            <TouchableOpacity onPress={()=>alert("Email can't be changed")}>

                <View pointerEvents='none'>
                    <TextInput style={nbStyles.textInput}
                    placeholder={'Email'}
                    value={data.email}
                    placeholderTextColor='#a9a9a9'
                    />
                </View>
            </TouchableOpacity>
            
            <TextInput style={nbStyles.textInput}
            placeholder={'Name'}
            value={data.name}
            placeholderTextColor='#a9a9a9'
            onChangeText={(val)=>this.setState({name:val})}
            />
            <TextInput style={nbStyles.textInput}
            placeholder={'Telpon'}
            value={data.hp}
            placeholderTextColor='#a9a9a9'
            onChangeText={(val)=>this.setState({hp:val})}
            />
            <TouchableOpacity onPress={() => {this.pickerRef.show()}}>
                <View pointerEvents='none'>
                    <TextInput style={nbStyles.textInput}
                    placeholder={'Gender'}
                    value={data.gender}
                    placeholderTextColor='#a9a9a9'
                    editable = {false}
                    />
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={Style.buttonSubmitGreenWithIcon} onPress={()=>this.save()}>
                <Text style={nbStyles.buttonText}>Submit</Text>
                <Icon active name='arrow-right' type="MaterialCommunityIcons" style={{color:'#fff'}} />
            </TouchableOpacity>
        </View>
    }

    renderAccordionContentPassword(){
        return <View>
            <TextInput style={nbStyles.textInput}
            placeholder={'Current Password'}
            placeholderTextColor='#a9a9a9'
            />  
            <TextInput style={nbStyles.textInput}
            placeholder={'New Password'}
            placeholderTextColor='#a9a9a9'
            />    
             <TextInput style={nbStyles.textInput}
            placeholder={'Confirm Password'}
            placeholderTextColor='#a9a9a9'
            />    
            <TouchableOpacity style={Style.buttonSubmitOrangeWithIcon}>
                <Text style={nbStyles.buttonText}>Submit</Text>
                <Icon active name='arrow-right' type="MaterialCommunityIcons" style={{color:'#fff'}} />
            </TouchableOpacity>
        </View>
    }


    render() {
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.Wrap}>
                        <Text style={nbStyles.headerTextBlack}>Edit Profile</Text>
                        
                    </View>
                    <View style={nbStyles.subWrap}>
                        <Accordion style={nbStyles.accordion} dataArray={[
                            {type:'profile',title:'Change Profile'},
                            {type:'password',title:'Change Passwords'}
                        ]} expanded={0}
                        renderHeader={this.renderAccordionHeader}
                        renderContent={this.renderAccordionContent}
                        />
                    </View>
                    <ReactNativePickerModule
                        pickerRef={e => this.pickerRef = e}
                        value={this.state.selectedIndexGender}
                        title={"Select a language"}
                        items={dataGender}
                        onValueChange={(val) => {
                            this.handleGenderChange(val)
                        }}/>
                </Content>
            </Container>
        );
    }
}
export default EditProfile;
