import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { Container, Content, Text, DatePicker, Button } from "native-base";
import nbStyles from "./Style";
import Style from "../../Theme/Style";
import SegmentedControlTab from "react-native-segmented-control-tab";
import BillingCardList from "@Component/Billing/BillingCardList";
import numFormat from "@Component/numFormat";
import OfflineNotice from "@Component/OfflineNotice";

import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config";

class Billing extends Component {
    _isMounted= false;

    static options(passProps) {
        return {
            topBar: {
                noBorder: true
            },
            bottomTabs: {
                visible: false,
                drawBehind: true,
                animate: true
            }
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            dateNow: new Date(),
            startDate: "2018-09-01",
            endDate: "2019-12-01",
            data: [],
            selectedIndex: 0,

            email: "",
            group: "",
            debtor: "",
            dataTower: [],
            name: "",
            type:"",
            totalInv: 0,

            isLoad: true
        };

        console.log(this.props);
    }

    async componentDidMount() {
        this._isMounted = true;
        const data = {
            email: await _getData("@User"),
            name: await _getData("@Name"),
            group: await _getData("@Group"),
            debtor: await _getData("@Debtor"),
            dataTower: await _getData("@UserProject"),
            totalInv: await _getData("@TotalInvoiceDue")
        };

        this.setState(data, () => {
            this.getBilling(this.state.selectedIndex);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getBilling = async type => {
        const dT = this.state.dataTower[0];
        this.setState({isLoad : true});
        const formData = {
            entity: dT.entity_cd,
            project: dT.project_no,
            name: this.state.name,
            date_start: this.state.startDate,
            date_end: this.state.endDate,
            type: this.state.type,
            email: this.state.email
        };

        data = JSON.stringify(formData);
        fetch(
            urlApi +
                "c_bill_history/getBill/" +
                dT.db_profile +
                "/" +
                this.state.group +
                "/" +
                this.state.debtor,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: data
            }
        )
            .then(response => response.json())
            .then(res => {
                const Data = res;
                if (this._isMounted) {
                    this.setState({ data: Data, isLoad: false });
                }
                console.log(res);

                // this.setState({refreshing: false});
            })
            .catch(error => {
                this.setState({ isLoad: false });
                console.log(error);
            });
    };

    handleIndexChange = index => {
        this.setState({
            selectedIndex: index
        });

        this.getBilling(index);

        console.log("Selected index", this.state.selectedIndex);
    };

    renderNullList(){
        return(
            <View style={nbStyles.nullList}>
                <Text style={[Style.textBlack,Style.textLarge]}>Data Not Available</Text>
            </View>
        )
    }

    render() {
        return (
            <Container>
                <OfflineNotice />
                <Content>
                    <View style={nbStyles.wrap}>
                        <View style={nbStyles.subWrap}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Text style={nbStyles.title}>Billing Info</Text>
                                <Text style={nbStyles.subTitle}>
                                    Rp. {numFormat(this.state.totalInv)}
                                </Text>
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <SegmentedControlTab
                                values={["Due", "Current"]}
                                selectedIndex={this.state.selectedIndex}
                                onTabPress={this.handleIndexChange}
                                activeTabStyle={nbStyles.activeTabStyle}
                                activeTabTextStyle={nbStyles.activeTabTextStyle}
                                tabStyle={nbStyles.tabStyle}
                                tabTextStyle={nbStyles.tabTextStyle}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 12,
                                marginLeft: 12,
                                marginTop: 16
                            }}
                        >
                            Date: {this.state.dateNow.toString().substr(4, 12)}
                        </Text>
                        {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View style={{marginTop:16}}>
                                <DatePicker 
                                defaultDate={new Date(2018, 4, 4)}
                                minimumDate={new Date(2018, 1, 1)}
                                maximumDate={new Date(2018, 12, 31)}
                                locale={"id"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: "green" }}
                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                onDateChange={this.setStartDate}
                                disabled={false}
                                />
                            </View>
                            <View style={{marginTop:16}}>
                                <DatePicker 
                                defaultDate={new Date(2018, 4, 4)}
                                minimumDate={new Date(2018, 1, 1)}
                                maximumDate={new Date(2018, 12, 31)}
                                locale={"id"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: "green" }}
                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                onDateChange={this.setEndDate}
                                disabled={false}
                                />
                            </View>
                        </View> */}
                        <View>
                            {this.state.data.length > 0 ? (
                                this.state.data.map((data, key) => (
                                    <BillingCardList key={key} data={data} />
                                ))
                            ) : this.state.isLoad ? (
                                <View style={nbStyles.nullList}>
                                    <ActivityIndicator
                                        size="large"
                                        color="#37BEB7"
                                    />
                                </View>
                            ) : (
                                this.renderNullList()
                            )}
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default Billing;
