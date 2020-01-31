import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    TextInput,
    ScrollView,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Container, Content, Text, DatePicker, Button, Tab } from "native-base";
import {
    Table,
    Row,
    Rows,
    TableWrapper,
    Cell
} from "react-native-table-component";
import nbStyles from "./Style";
import ModalSelector from "react-native-modal-selector";
import moment from "moment";
import numFormat from "@Component/numFormat";
import Style from "../../Theme/Style";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Navigation } from "react-native-navigation";
import OfflineNotice from "@Component/OfflineNotice";

import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config";

class SoaList extends Component {
    static options(passProps) {
        return {
            topBar: {
                noBorder: true,
                title: {
                    text: "Statement of Account"
                }
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
        console.log("props", props);

        this.state = {
            email: "",
            totalInv: 0,
            dataRow: [],
            jumlah: 0,

            isLoad : true
        };
    }

    async componentDidMount() {
        const data = {
            email: await _getData("@User")
            // totalInv : await _getData('@TotalInvoiceDue')
        };

        this.setState(data, () => {
            this.getSoa();
        });
    }

    getSoa = () => {
        const dT = this.props.items.selProject;
        const debtor = this.props.items.debtor;
        const { startDate, endDate } = this.props.items;
        this.setState({isLoad : true})

        const formData = {
            email: this.state.email,
            entity: dT.entity_cd,
            project: dT.project_no,
            date_start: startDate,
            date_end: endDate,
            debtor_acct: debtor.debtor_acct
        };

        fetch(urlApi + "c_bill_history/getSoa/" + dT.db_profile, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    const resData = res.Data;
                    const data = [];
                    let jumlah = 0;
                    let totalInv = 0;
                    resData.map(val => {
                        data.push([
                            moment(val.due_date).format("DD MMM YYYY"),
                            val.descs +",\n"+ val.debit_doc +",\n"+ moment(val.debit_date).format("DD MMM YYYY")+",\n"+val.credit_doc+",\n"+val.mdoc_amt,
                            numFormat(
                                val.class == "M" || val.class == "C"
                                    ? -1 * val.fbal_amt
                                    : val.fbal_amt
                            )
                        ]);
                        totalInv = totalInv + parseFloat(val.previous_balance);
                        jumlah =
                            jumlah +
                            parseFloat(
                                val.class == "M" || val.class == "C"
                                    ? -1 * val.fbal_amt
                                    : val.fbal_amt
                            );
                    });
                    console.log("totalInv", totalInv);
                    this.setState({
                        dataRow: data,
                        jumlah: jumlah,
                        totalInv: totalInv,
                    });
                }
                this.setState({isLoad : false})
                console.log("resSoa", res);
            })
            .catch(error => {
                this.setState({isLoad : false})
                console.log(error);
            });
    };

    render() {
        const item = this.props.items;
        const totalInv = parseFloat(this.state.totalInv);
        const totalAmt = parseFloat(this.state.jumlah);
        const endBalance = totalInv + totalAmt;
        const tables = {
            tableHead: ["Doc Date", "Description", "Balance"],
            jumlah: ["", "Total", numFormat(totalAmt)]
        };

        return (
            <Container>
                <OfflineNotice />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.dataRow.length > 0 ? (
                        <View style={nbStyles.wrap}>
                            <Text style={Style.textBlack}>Debtor Name : {item.debtor.name}</Text>
                            {/* <Text style={Style.textBlack}>
                                Previous Balance : {numFormat(totalInv)}
                            </Text> */}
                            <Text style={Style.textBlack}>
                                Periode :{" "}
                                {moment(item.startDate).format("DD MMM YYYY")} -{" "}
                                {moment(item.endDate).format("DD MMM YYYY")}{" "}
                            </Text>

                            <Table>
                                <Row
                                    data={tables.tableHead}
                                    style={styles.head}
                                    textStyle={[Style.textBlack,styles.text]}
                                />
                                {this.state.dataRow.map((rowData,index)=>
                                    <Row
                                        key={index}
                                        data={rowData}
                                        style={[styles.row, index%2 && {backgroundColor: '#f3f3f3'}]}
                                        textStyle={[Style.textGreyDark,styles.text]}
                                    />
                                )}
                                
                                <Row
                                    data={tables.jumlah}
                                    textStyle={styles.text}
                                />
                            </Table>

                            {/* <Text>
                                End Balance : Rp. {numFormat(endBalance)}
                            </Text> */}
                        </View>
                    ) : this.state.isLoad ? (
                        <View style={nbStyles.nullList}>
                            <ActivityIndicator size="large" />
                        </View>
                    ) : (
                        <View style={nbStyles.nullList}>
                            <Text style={[Style.textBlack, Style.textLarge]}>
                                Data Empty
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </Container>
        );
    }
}
export default SoaList;
const styles = StyleSheet.create({
    input: {
        height: 40,
        backgroundColor: "#f5f5f5",
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    inputs: {
        height: 80,
        backgroundColor: "#f5f5f5",
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10
    },
    head: { height: 40, backgroundColor: "#f1f8ff" },
    text: { margin: 6 },
    row: {  backgroundColor: '#fff' }
});
