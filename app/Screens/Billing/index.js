// Note : ini semua masih hardcode
import React, { Component } from "react";
import { 
    View,
} from "react-native";
import {Container, Content} from 'native-base'
import nbStyles from './Style'
import {Navigation} from 'react-native-navigation'
import Title from '@Component/Title'
import SubTitle from '@Component/SubTitle'
import ButtonMenuGrid from '@Component/ButtonMenuGrid'
import OfflineNotice from '@Component/OfflineNotice';

class BillIndex extends Component {

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

    constructor(props){
        super(props);

        Navigation.events().bindComponent(this);
    }
    
    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName
            }
        })
    }
    render() {
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap}>
                        <Title text="Finance"/>
                        <SubTitle text="What we can help you"/>
                        {/* Start Menu Kotak Kotak */}
                        <View style={nbStyles.menuWrap}> 
                            <View  style={nbStyles.btnLayout}>
                                <ButtonMenuGrid imgUrl={require('@Asset/images/icon-home/bill_blue.png')} 
                                text="Billing"
                                tapTo="screen.BillingList"
                                {...this.props}/>
                                <ButtonMenuGrid imgUrl={require('@Asset/images/icon-home/accounting_blue.png')} 
                                text="Statement of Account"
                                tapTo="screen.SoaSearch"
                                {...this.props}/>
                            </View>
                        </View>
                        {/* END MENU KOTAK KOTAK */}
                    </View>
                </Content>
            </Container>
        );
    }
}
export default BillIndex;
