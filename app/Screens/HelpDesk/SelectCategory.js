// Note : ini semua masih hardcode
import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import { Container, Header, Content, List, ListItem, Text, Left, Right, Icon } from 'native-base';
import nbStyles from './Style'
import {Navigation} from 'react-native-navigation'
import Title from '@Component/Title'
import SubTitle from '@Component/SubTitle'
import ButtonMenuGrid from '@Component/ButtonMenuGrid'
import OfflineNotice from '@Component/OfflineNotice';
import {urlApi} from '@Config';



class SelectCategory extends Component {

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
          isDisabled : false,
          category_code : props.category_code,
          dataCategoryDetail : [],
          titleCategory : ''
        }
        
        console.log('props', props)
        Navigation.events().bindComponent(this);
        
    }

    componentDidMount(){
      this._isMount = true;
      this.getCategoryDetail()
    }

    getCategoryDetail = () => {
      const dT = this.props.prevProps.dataTower[0]

      const formData = {
          entity : dT.entity_cd,
          project : dT.project_no,
          category_group : this.state.category_code,
          complain_type : this.props.prevProps.typeTicket
      }

      fetch(urlApi+'c_ticket_entry/getCategoryDetail/IFCAPB',{
          method : "POST",
          body :JSON.stringify(formData)
      })
      .then((response) => response.json())
      .then((res)=>{
          if(res.Error === false){
              let resData = res.Data
              if(this._isMount){
                this.setState({
                    dataCategoryDetail : resData,
                    titleCategory : resData[0].descs_category_group
                })
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

    onCategoryPress = (cat) =>{
      this.setState({isDisabled:true},()=>{
        this.goToScreen('screen.SubmitHelpDesk',cat)
      })
    }

    goToScreen = (screenName,pass) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps : {
                  prevProps : this.props.prevProps,
                  category_cd : pass
                }
            }
        })
    }

    componentDidDisappear(){
      this.setState({isDisabled:false})
    }

    render() {
        return (
            <Container>
                <OfflineNotice/>
                <Content style={nbStyles.wrap}>
                  <Title text={this.state.titleCategory}/>   
                  <View pointerEvents={this.state.isDisabled ? 'none' : 'auto'}>
                    <List>
                      {this.state.dataCategoryDetail.map((data,key)=>
                        <ListItem key={key} onPress={()=>this.onCategoryPress(data.category_cd)}>
                          <Left>
                            <Text>{data.descs}</Text>
                          </Left>
                          <Right>
                            <Icon name="arrow-forward"/>
                          </Right>
                        </ListItem>
                      )}
                    </List>
                  </View>
                </Content>
            </Container>
        );
    }
}
export default SelectCategory;

const styles = StyleSheet.create({
    listvieww: {

        marginTop: 20
    },
    listitemm: {
        height: 100
    }
});
