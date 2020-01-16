import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
    Container,
    Content,
    Text,
    DatePicker,
    Button,
    Card
} from "native-base";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
import nbStyles from "./Style";
import Style from "../../Theme/Style";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { ListItem, Icon } from "react-native-elements";
import OfflineNotice from "@Component/OfflineNotice";
import numFormat from "../../components/numFormat";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config";

class Metrix extends Component {
    _isMount = false;

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
            chosenDate: new Date(),
            email: "",
            spinner: true,

            dataMeter: []
        };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    async componentDidMount() {
        this._isMount = true;
        const data = {
            email: await _getData("@User"),
            token: await _getData("@Token"),
            tower: await _getData("@UserProject")
        };

        this.setState(data, () => {
            this.getMeter(data.tower);
        });
    }
    componentWillUnmount() {
        this._isMount = false;
    }

    getMeter = data => {
        const dT = data[0];

        const formData = {
            entity_cd: dT.entity_cd,
            project_no: dT.project_no,
            email: this.state.email
        };
        fetch(urlApi + "c_meter_utility/getData/" + dT.db_profile, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    let resData = res.Data;
                    if (this._isMount) {
                        this.setState({ dataMeter: resData, spinner: false });
                    }
                }
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });

        console.log("Selected index", this.state.selectedIndex);
    };

    meterType(type) {
        if (type == "E") {
            return " KWH";
        }

        return " M3";
    }

    render() {
        return (
            <Container>
                <OfflineNotice />
                <Content>
                    <View style={nbStyles.wrap}>
                        <View style={nbStyles.subWrap}>
                            <View style={nbStyles.subWrap}>
                                <Text style={nbStyles.title}>
                                    Meter Utility
                                </Text>
                            </View>
                        </View>

                        <Text style={nbStyles.subWrap}>
                            Date:{" "}
                            {this.state.chosenDate.toString().substr(4, 12)}
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
                                onDateChange={this.setDate}
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
                                onDateChange={this.setDate}
                                disabled={false}
                                />
                            </View>
                        </View> */}

                        <View style={styles.listview}>
                            {this.state.spinner ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#37BEB7"
                                />
                            ) : (
                                this.state.dataMeter.map((data, key) => (
                                    <Card key={key} style={styles.card}>
                                        <View>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent:
                                                        "space-between"
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        Style.textBold,
                                                        Style.textMedium,
                                                        Style.textLeft
                                                    ]}
                                                >
                                                    {data.lot_no}
                                                </Text>
                                                <Text
                                                    style={[
                                                        Style.textGreyLight,
                                                        Style.textSmall,
                                                        Style.textRight
                                                    ]}
                                                >
                                                    {data.descs}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent:
                                                        "space-between"
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        Style.textOrange,
                                                        Style.textMedium,
                                                        Style.textLeft
                                                    ]}
                                                >
                                                    {data.name}
                                                </Text>
                                                <View>
                                                    <Text
                                                        style={[
                                                            Style.textGreyDark,
                                                            Style.textRight,
                                                            Style.textSmall
                                                        ]}
                                                    >
                                                        {data.meter_id}
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'300',
                                                textAlign:'left',
                                                color:'#9B9B9B'
                                            }}>
                                                {moment(data.doc_date).format("MMM DD YYYY")}
                                            </Text>
                                        </View> */}
                                            <View
                                                style={{
                                                    borderBottomWidth: 1,
                                                    borderBottomColor:
                                                        "#F3F3F3",
                                                    marginTop: 5
                                                }}
                                            />
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    marginTop: 5,
                                                    justifyContent:
                                                        "space-between"
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Icon
                                                        name="event"
                                                        size={13}
                                                        color="#9B9B9B"
                                                    />
                                                    <Text
                                                        style={[
                                                            Style.textGreyDark,
                                                            Style.textSmall,
                                                            Style.textLeft
                                                        ]}
                                                    >
                                                        {" "+moment(
                                                            data.doc_date
                                                        ).format("DD MMM YYYY")}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            Style.textGreen,
                                                            Style.textRight,
                                                            Style.textSmall
                                                        ]}
                                                    >
                                                        {"Rp. "+numFormat(
                                                            data.trx_amt
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Title */}
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    marginTop: 8
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        Style.textBold,
                                                        Style.textSmall
                                                    ]}
                                                >
                                                    Current
                                                </Text>
                                                <Text
                                                    style={[
                                                        Style.textBold,
                                                        Style.textSmall
                                                    ]}
                                                >
                                                    Last
                                                </Text>
                                                <Text
                                                    style={[
                                                        Style.textBold,
                                                        Style.textSmall
                                                    ]}
                                                >
                                                    Total x
                                                    {parseInt(data.multiplier)}
                                                </Text>
                                            </View>

                                            {/* Value */}
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        Style.textBold,
                                                        Style.textSmall
                                                    ]}
                                                >
                                                    {data.curr_read +
                                                        this.meterType(
                                                            data.meter_type
                                                        )}
                                                </Text>
                                                <Text>|</Text>
                                                <Text
                                                    style={[
                                                        Style.textBold,
                                                        Style.textSmall
                                                    ]}
                                                >
                                                    {data.last_read +
                                                        this.meterType(
                                                            data.meter_type
                                                        )}
                                                </Text>
                                                <Text>|</Text>
                                                <Text
                                                    style={[
                                                        Style.textBold,
                                                        Style.textSmall
                                                    ]}
                                                >
                                                    {data.usage +
                                                        this.meterType(
                                                            data.meter_type
                                                        )}
                                                </Text>
                                            </View>
                                            {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'300',
                                                textAlign:'left',
                                                color:'#9B9B9B'
                                            }}>
                                                Previous
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'500',
                                                textAlign:'left',
                                                marginRight:20,
                                                color:'#9B9B9B'
                                            }}>
                                                Current
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'500',
                                                textAlign:'left',
                                                color:'#9B9B9B'
                                            }}>
                                                Usage
                                            </Text>
                                        </View> */}
                                        </View>
                                    </Card>
                                ))
                            )}
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default Metrix;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#37BEB7",
        shadowOpacity: 0.5,
        elevation: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    listview: {
        marginTop: 54
    },
    listitemm: {
        height: 100
    }
});
