import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import {Card} from 'native-base'
import numFormat from '@Component/numFormat'
import Style from '../../Theme/Style';

class BillingCardList extends Component {

    constructor(props){
        super(props);
        const data = props.data
        // this.state = {
        //     tower   : data.tower,
        //     amt     : data.mdoc_amt,
        //     debtor  : data.name,
        //     date    : data.doc_date.toString().substr(0, 10)
        // }


    }
    render() {
        
        const {tower,mdoc_amt,name,doc_date,due_date, descs} = this.props.data
        return (
            <Card style={{
                backgroundColor: 'white',
                shadowOffset : { width:1, height: 1},
                shadowColor:"#37BEB7",
                shadowOpacity:0.5,
                elevation:5,
                paddingHorizontal:10,
            }}>
                <View style={{paddingVertical:10}}>
                    <View style={{paddingBottom:10,flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={[Style.textGrey,Style.textSmall]}>
                            {tower}
                        </Text>
                        <Text style={[Style.textOrange,Style.textMedium]}>
                            Rp. {numFormat(mdoc_amt)}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={[Style.textBlack,Style.textSmall]}>
                            {name}
                        </Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>

                        <Text style={[Style.textGreyLight,Style.textSmall]}>
                            Doc Date {doc_date.toString().substr(0, 10)}
                        </Text>
                        <Text style={[Style.textGreyLight,Style.textSmall]}>
                           Due Date {due_date.toString().substr(0, 10)}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <Text style={[Style.textGreyLight,Style.textSmall,{marginTop : 10}]}>
                        {descs}
                    </Text>

                    </View>
                </View>
            </Card>
        );
    }
}
export default BillingCardList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});