// Note : ini semua masih hardcode
import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    PixelRatio,
    TextInput,
    Alert,
    ActivityIndicator
} from "react-native";
import { Container, Header, Content, List, ListItem, Text, Left, Right,Textarea, Button } from 'native-base';
import nbStyles from './Style'
import Style from '@Theme/Style'
import {Navigation} from 'react-native-navigation'
import Title from '@Component/Title'
import SubTitle from '@Component/SubTitle'
import ButtonMenuGrid from '@Component/ButtonMenuGrid'
import ImagePicker from 'react-native-image-crop-picker';
// import Icon from 'react-native-vector-icons/FontAwesome'
import {Icon} from 'react-native-elements'
import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment';
import OfflineNotice from '@Component/OfflineNotice';
import {urlApi} from '@Config';



class SubmitHelpDesk extends Component {
    _isMount = false;

    static options(passProps){
        return {
            topBar : {
                noBorder:true
            },
            bottomTabs :{
                visible : false,
                drawBehind: true, 
                animate: true
            }
        }
    }

    constructor(props){
        super(props);

        this.state = {
            title : '',
            prevProps : props,
            txtDesc: '',
            txtLocation : '',

            image: [],

            isLoading : false,
            loadingText : 'Loading ...'
        }
        
        console.log('props', props)
        // this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
        Navigation.events().bindComponent(this);
        
    }
    componentDidMount(){
        this._isMount = true;
        const prevProps = this.props.prevProps
        let titles = ''
        if(prevProps.typeTicket == "C"){
            titles = "Complain"
        } else if(prevProps.typeTicket == "R") {
            titles = "Request"
        } else {
            titles = "Application"
        }
        this.setState({title:titles})
    }
    
    componentWillUnmount(){
        this._isMount =false
    }

    handlePhotoPick = () => {
        console.log('datImage', this.state.image)
        Alert.alert(
            'Select a Photo',
            'Choose the place where you want to get a photo',
            [
              {text: 'Gallery',onPress: () => this.fromGallery()},
              {text: 'Camera', onPress: () => this.fromCamera()},
              {text: 'Cancel', onPress: () => console.log('User Cancel'),style: 'cancel'},
            ],
            {cancelable: false},
          );
    }
    fromCamera() {

        ImagePicker.openCamera({
          cropping: false,
          width : 500,
          height : 500,
        }).then(image => {
          console.log('received image', image);

          this.setState(prevState => ({
            image: [...prevState.image, {uri: image.path, width: image.width, height: image.height, mime: image.mime}]
          }))
      
        }).catch(e => console.log('tag', e));
    }

    fromGallery(cropping, mediaType='photo') {

        ImagePicker.openPicker({
        multiple : true,
        width : 500,
        height : 500,
        }).then(image => {
          console.log('received image', image);

          for(var i = 0 ; i < image.length; i++){
                    
            this.setState(prevState => ({
                image: [...prevState.image, {uri: image[i].path, width: image[i].width, height: image[i].height, mime: image[i].mime}]
            }))
          }
      
        }).catch(e => console.log('tag', e));
    }

    removePhoto = async(key) =>{
        let imageArray = [...this.state.image]
        imageArray.splice(key, 1);
        this.setState({image: imageArray});
    }

    onSubmit = () =>{
        this.setState({isLoading : true,loadingText:'Saving data ...'})

        const prevProps = this.props.prevProps
        const formData = {
            rowID : prevProps.rowId,
            cons : 'IFCAPB',
            audit_user : prevProps.audit_user,
            Rtype : prevProps.typeTicket,
            entity : prevProps.entity,
            project : prevProps.project,
            debtor : prevProps.debtor,
            request_by : prevProps.textUsername,
            contact_no : prevProps.textContact,
            lot_no : prevProps.textLot,
            floorr : prevProps.textFloor,
            ticket_no : prevProps.ticketNo,
            categoryy : prevProps.appType == '' ? this.props.category_cd : prevProps.appType,
            descript : this.state.txtDesc,
            location : this.state.txtLocation,
            email : prevProps.email,
            cmpsource : prevProps.comSource,
            seqnotick : prevProps.seqNo
        }

        console.log('fromData', formData)
        
        fetch(urlApi+'c_ticket_entry/saveticket/',{
          method : "POST",
          body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log('response', res)

            if(res.Error === false){
                if(this._isMount){
                    this.setState({isLoading : false})
                    if(this.state.image.length !== 0){
                        this.uploadPhoto()
                    }else {
                        this.setState({isLoading:false},()=>
                        this.showAlert('Data saved successfuly'))
                    }
                }
            }else {
                this.setState({isLoading:false},()=>
                alert('Saving data Failed'))
            }
        }).catch((error) => {
            this.setState({isLoading : false})
            console.log(error);
        });
        

    }

    uploadPhoto = () =>{
        this.setState({isLoading : true,loadingText:'Uploading image ...'})

        const x = this.props.prevProps;
    
        const data = {
            cons : 'IFCAPB',
            entity : x.entity,
            project : x.project,
            request_by : x.textUsername,
            seqNo : x.seqNo
        }

        this.state.image.map((images,index)=>{
            let fileName = x.textUsername + '_' + moment(new Date).format('MMDDYYYY') + '_ticket_' + (index+1) +'.jpg';
            let fileImg = RNFetchBlob.wrap(images.uri.replace('file://',''));

            const frmData = {
                data : data,
                seq_no_pict : index
            } 

            RNFetchBlob.fetch('POST', urlApi+'c_ticket_entry/upload/IFCAPB', {
                'Content-Type' : 'multipart/form-data',
            }, [
                { name : 'photo', filename : fileName, data: fileImg},
                { name : 'data', data: JSON.stringify(frmData)},
            ]).then((resp) => {
                console.log('resp', resp)
                if((index+1) === this.state.image.length){
                    if(this._isMount){
                        this.setState({isLoading:false},()=>
                            this.showAlert('Data saved successfuly')
                        )
                    }
                }
            })
        })
       
    }


    getCategoryDetail = () => {
      const dT = this.props.prevProps.dataTower[0]

      const formData = {
          entity : dT.entity_cd,
          project : dT.project_no,
          category_group : this.state.category_code
      }

      fetch(urlApi+'c_ticket_entry/getCategoryDetail/IFCAPB',{
          method : "POST",
          body :JSON.stringify(formData)
      })
      .then((response) => response.json())
      .then((res)=>{
          if(res.Error === false){
              let resData = res.Data
              // console.log('response', resData)
              if(this._isMount){
                this.setState(
                    {
                      dataCategoryDetail : resData,
                      titleCategory : resData[0].descs_category_group
                    }
                )
              }
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
    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName
            }
        })
    }

    handleNext = (nextScreen) =>{
        this.refs[nextScreen].wrappedInstance.focus()
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
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap} pointerEvents={this.state.isLoading ? 'none' : 'auto'}>
                
                <Title text={this.state.title}/>  
                 
                <View style={nbStyles.subWrap}>
                    {this.state.title !== "Application" &&
                    <TextInput style={Style.input}
                    placeholder={this.state.title + " Location"}
                    placeholderTextColor='#a9a9a9'
                    returnKeyType='next'
                    autoCorrect={false}
                    ref={"txtLocation"}
                    value={this.state.textContact}
                    onChangeText={(text)=> this.setState({txtLocation : text})}
                    onSubmitEditing={()=> this.handleNext('txtDescs')}
                    />
                    }
                    <Textarea ref="txtDescs" placeholderTextColor="#a9a9a9" style={nbStyles.textArea} bordered rowSpan={5} placeholder="Description"
                    onChangeText={(text)=>this.setState({txtDesc:text})} blurOnSubmit>
                    </Textarea>

                    {this.state.title !== "Application" &&
                    <View style={nbStyles.pickerWrap}>
                        <Text>Attachment</Text>
                        {this.state.image.length === 0 ? 
                            <TouchableOpacity style={[nbStyles.sel,{ marginBottom: 20 },]} onPress={()=>this.handlePhotoPick()}>
                                <View>
                                    <Text>Select a Photo</Text>
                                    {/* <Icon name="times" size={25} /> */}
                                </View>
                            </TouchableOpacity>    
                        :
                        <View>
                            {this.state.image.map((data,key)=>
                            <TouchableOpacity key={key} style={nbStyles.avatarContainer} onPress={()=>console.log('Photo Tapped')}>
                                <View>
                                    <Image style={nbStyles.avatar} source={this.state.image[key]} />
                                    <Icon
                                    name={'clear'}
                                    color= '#5A110D'
                                    containerStyle={nbStyles.iconRemove}
                                    onPress={() => this.removePhoto(key)}/>
                                </View>
                            </TouchableOpacity>
                            )}
                            <TouchableOpacity style={[nbStyles.sel,{ marginBottom: 20 },]} onPress={()=>this.handlePhotoPick()}>
                                <View>
                                    <Text>Select a Photo</Text>
                                </View>
                            </TouchableOpacity> 
                        </View>
                        }
                    </View>
                    }
                    
                </View>
                <View style={nbStyles.subWrap}>
                    <Button block style={Style.buttonSubmit} onPress={()=>this.onSubmit()}>
                    {this.state.isLoading === false ?
                        <Text>SUBMIT</Text>
                    :
                        <View style={nbStyles.btnLoadingWrap}>
                            <ActivityIndicator size="small" color="#fff"/>
                            <Text>{this.state.loadingText}</Text>
                        </View>
                    }
                    </Button>
                </View>
                </View>
                </Content>
            </Container>
        );
    }
}
export default SubmitHelpDesk;

const styles = StyleSheet.create({
    listvieww: {

        marginTop: 20
    },
    listitemm: {
        height: 100
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
      
});
