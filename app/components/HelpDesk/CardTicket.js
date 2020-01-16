import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image
} from "react-native";
import {
    Container,
    Content,
    Text,
    DatePicker, Button, Card
} from 'native-base'
import nbStyles from './Style'
import Style from '@Theme/Style'
import Star from 'react-native-star-view';
import moment from 'moment'
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modal'
import StarRating from 'react-native-star-rating';
import {urlApi} from '@Config';

class CardTicket extends Component {

    constructor(props){
        super(props)

        this.state={
            isDisabled : false,
            modalVisible :false,
            starCount: 0,
            audit_user : '',
            selectedComplainNo : ''
        }
        Navigation.events().bindComponent(this);

    }

    setModalVisible(visible,complain_no) {
        let cNo = !visible  ? '' : complain_no
        this.setState({
            modalVisible: visible,
            selectedComplainNo:cNo
        });
    }

    onStarRatingPress(rating) {
        this.setState({
          starCount: rating
        });
    }

    btnSubmit =()=>{
        const formData = {
            complain_no : this.state.selectedComplainNo,
            rating : this.state.starCount,
            audit_user : this.state.audit_user
        }

        console.log('formdata', formData)
        fetch(urlApi+'c_ticket_entry/setDone/IFCAPB',{
          method : "POST",
          body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            console.log('response', res)

            if(res.Error === false){
                let resData = res.Data
                this.setModalVisible(!this.state.modalVisible)
                Navigation.pop(this.props.componentId)
            }
        }).catch((error) => {
            console.log(error);
        });
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
            if(res.Error === false){
                let resData = res.Data;
                this.goToScreen(resData,'screen.ViewHistoryDetail')
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidDisappear(){
        this.setState({isDisabled:false})
    }

    handleNavigation =(data)=>{
        this.setState({isDisabled:true},()=>{
            this.goToScreen(data,'screen.ViewHistoryDetail')
        })
    }

    goToScreen = (data,screenName) => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
                passProps : {
                    dataTicket : data,
                    email : this.props.email
                }
            }
        })
    }
    render() {
        const data = this.props.data
        const deviceWidth = Dimensions.get("window").width;

        return (
            <View>
            <TouchableOpacity onPress={()=>this.handleNavigation(data)} disabled={this.state.isDisabled}>
                <Card style={{
                    height: null,
                    backgroundColor: 'white',
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: "#37BEB7",
                    shadowOpacity: 0.5,
                    elevation: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 10
                }} >
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '300',
                                textAlign: 'left'
                            }}>
                                Ticket No : # {data.complain_no}
                                </Text>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '500',
                                textAlign: 'right',
                                color: '#9B9B9B'
                            }}>
                                Date : {moment(data.reported_date).format('DD-MM-YYYY')}
                                </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '300',
                                textAlign: 'left'
                            }}>
                                Workorder No : # {data.report_no}
                                </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#F99B23'
                            }}>
                                {data.complain_type == "C" ? "Complain" : "Request"}
                            </Text>
                            <TouchableOpacity onPress={()=>this.goToScreen(data,"screen.Chat")}>
                                <Image style={styles.img} source={require('@Asset/images/chat.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '500',
                                textAlign: 'left',
                                color: '#9B9B9B'
                            }}>
                                Work Requested
                                </Text>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#F3F3F3', marginTop: 8 }} />
                        <View style={{ borderColor: '#f5f5f5', backgroundColor: '#f5f5f5', height: null, width: null }}>
                            <Text style={{ fontSize: 12, fontWeight: '200', color: '#9B9B9B', padding: 8 }}>
                                {data.work_requested}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '300',
                                textAlign: 'left'
                            }}>
                                Status : {
                                            data.status == "R" ? "Open":
                                            data.status == "A" ? "Assign":
                                            data.status == "S" ? "Need Confirmation":
                                            data.status == "P" ? "Procces":
                                            data.status == "F" ? "Confirm":
                                            data.status == "V" ? "Solve":
                                            data.status == "C" ? "Completed":
                                            data.status == "D" ? "Done" :
                                            ""
                                            }
                                </Text>

                                <View >
                                    {data.status === 'C' && 
                                        <TouchableOpacity onPress={()=>this.setModalVisible(true,data.complain_no)}>
                                            <Text>Rate Me !!!</Text>
                                        </TouchableOpacity>
                                    }
                                    {data.status === 'D' &&
                                        <Star score={parseFloat(data.rating_us)} style={starStyle} />
                                    }
                                </View>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
            <Modal
            animationType="slide"
            isVisible={this.state.modalVisible}
            deviceWidth={deviceWidth}
            style={nbStyles.bottomModal}>
            <View style={nbStyles.modalView}>
                <View style={nbStyles.modalContainer}>
                    <View style={nbStyles.modalHeader}>
                        <Text style={[Style.textBlack,nbStyles.textModal]}>{this.state.selectedComplainNo}</Text>
                        <Icon style={nbStyles.iconModal} name="times" onPress={()=> this.setModalVisible(!this.state.modalVisible)}/>
                    </View>
                    <View style={nbStyles.modalBody}>
                        <View>
                            <Text style={[Style.textBlack,nbStyles.modalBodyTitle]}>Please rate our work !</Text>
                        </View>
                        <View style={nbStyles.starWrap}>
                            <StarRating
                                fullStarColor={'#F9A233'}
                                disabled={false}
                                maxStars={5}
                                rating={this.state.starCount}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                            />
                        </View>
                    
                        <View style={nbStyles.btnWrapModal}>
                            <TouchableOpacity style={nbStyles.btnNo} onPress={()=> this.setModalVisible(!this.state.modalVisible)}>
                                <Text style={nbStyles.textNo}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={nbStyles.btnYes} onPress={() => this.btnSubmit()}>
                                <Text style={nbStyles.textYes}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
        </View>
        );
    }
}
export default CardTicket;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    img :{
        width : 35,
        height :35,
        marginHorizontal: 5,
        marginVertical: 5,
    }
});
const starStyle = {
    width: 100,
    height: 20,
    marginBottom: 20,
};