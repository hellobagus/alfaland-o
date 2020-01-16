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

class CategoryHelp extends Component {

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
        console.log('props', props)

        this.state = {
          dataCategory : [],
          isDisabled : false
        }
        

        Navigation.events().bindComponent(this);
        
    }

    componentDidMount(){
      this._isMount = true;
      this.getCategoryHelp()
    }

    componentWillUnmount(){
      this._isMount = false;
    }

    getCategoryHelp = () => {
      const dT = this.props.prevProps.dataTower[0]

      const formData = {
          entity : dT.entity_cd,
          project : dT.project_no
      }

      fetch(urlApi+'c_ticket_entry/getCategoryHelp/IFCAPB',{
          method : "POST",
          body :JSON.stringify(formData)
      })
      .then((response) => response.json())
      .then((res)=>{
          if(res.Error === false){
              let resData = res.Data
              if(this._isMount){
                this.setState({dataCategory : resData})
              }
          }
      }).catch((error) => {
          console.log(error);
      });
    }

    onCategoryPress = (cat) =>{
      this.setState({isDisabled:true},()=>{
        this.goToScreen('screen.SelectCategory',cat)
      })
    }

    goToScreen = (screenName,pass) => {
      Navigation.push(this.props.componentId,{
          component:{
              name : screenName,
              passProps : {
                prevProps : this.props.prevProps,
                category_code : pass
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
                  <Title text="Category Help"/>   
                  <View pointerEvents={this.state.isDisabled ? 'none' : 'auto'}>
                    <List>
                      {this.state.dataCategory.map((data,key)=>
                        <ListItem key={key} onPress={()=>this.onCategoryPress(data.category_group_cd)} >
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
export default CategoryHelp;

const styles = StyleSheet.create({
    listvieww: {

        marginTop: 20
    },
    listitemm: {
        height: 100
    }
});
