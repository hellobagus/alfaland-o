import React, { Component } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Dimensions
} from "react-native";
import { Container, Content, Text, Button } from "native-base";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";
import nbStyles from "./Style";
import numFormat from "../../components/numFormat";
import Style from "../../Theme/Style";
import { Navigation } from "react-native-navigation";
import OfflineNotice from "@Component/OfflineNotice";
import { overtimeService, ticketService } from "../../_services";
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config";
import Modalize from "react-native-modalize";
import { DateInput, SubmitInput, DropdownInput } from "../../components/Input";

class AddOvertime extends Component {
    _isMount = false;

    static options() {
        return {
            topBar: {
                noBorder: true,
                visible: true
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
            chosenDate: props.chosenDate,
            dataTower: props.dataTower,
            dataLot: [],
            dataDebtor: [],
            dataOverType: [],
            dataCalculate: [],
            email: "",

            selectedTower: {
                dbProfile: props.dataTower[0].db_profile,
                entity: props.dataTower[0].entity_cd,
                project: props.dataTower[0].project_no,
                project_descs: props.dataTower[0].project_descs
            },

            selectedOvType: {
                over_cd: "",
                descs: ""
            },
            textDebtor: "",
            textLot: "",
            levelNo: "",
            debtorAcct: "",
            descsLevel: "",
            total: "",
            rate: 0,
            zone_cd: "",
            totalUsage: 0,
            isVisible: false,
            startVisible: false,
            endVisible: false,
            dateVisible: false,

            startTime: new Date(),
            endTime: new Date(),

            endMinimumDate: new Date(),

            isLoading: false
        };

        console.log("props", props);

        this.setDate = this.setDate.bind(this);
        Navigation.events().bindComponent(this);
    }

    async componentDidMount() {
        this._isMount = true;

        const datas = {
            email: await _getData("@User")
        };

        this.setState(datas, () => {
            this.getLot();
            this.getDebtor();
            // this.getStartTime()
            this.getOverType();
        });
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    getLot = () => {
        const dT = this.state.selectedTower;

        const formData = {
            cons: dT.dbProfile,
            entity_cd: dT.entity,
            project_no: dT.project,
            email: this.state.email
        };

        overtimeService.getLot(formData).then(res => {
            if (res.Error === false) {
                let resData = res.Data;
                if (this._isMount) {
                    this.setState({ dataLot: resData });
                }
            }
        });
    };

    getDebtor = () => {
        const dT = this.state.selectedTower;

        const formData = {
            cons: dT.dbProfile,
            entity: dT.entity,
            project: dT.project,
            email: this.state.email
        };

        ticketService.getDebtor(formData).then(res => {
            if (res.Error === false) {
                const resData = res.Data;
                if (this._isMount) {
                    console.log("debtor", resData);
                    this.setState({ dataDebtor: resData });
                }
            }
        });
    };

    getOverType = () => {
        const dT = this.state.selectedTower;

        const formData = {
            cons: dT.dbProfile,
            entity_cd: dT.entity,
            project_no: dT.project
        };
        overtimeService.getOver(formData).then(res => {
            if (res.Error === false) {
                const resData = res.Data;
                if (this._isMount) {
                    this.setState({ dataOverType: resData });
                }
            }
        });
    };

    // getStartTime = () => {
    //     const dT = this.state.selectedTower;

    //     const formData = {
    //         entity_cd: dT.entity,
    //         project_no: dT.project,
    //         StartDate: this.state.chosenDate
    //     };
    //     fetch(urlApi + "c_overtime/addStart/IFCAPB", {
    //         method: "POST",
    //         body: JSON.stringify(formData)
    //     })
    //         .then(response => response.json())
    //         .then(res => {
    //             if (res.Error === false) {
    //                 const resData = res.Data[0];
    //                 if (this._isMount) {
    //                     this.setState({ startTime: resData.ov_start });
    //                 }
    //             }
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // };

    getTrxRate = () => {
        const dT = this.state.selectedTower;

        const formData = {
            cons: dT.dbProfile,
            entity_cd: dT.entity,
            project_no: dT.project,
            over_cd: this.state.selectedOvType.over_cd
        };

        overtimeService.getRate(formData).then(res => {
            if (res.Error === false) {
                const resData = res.Data;
                let rates = parseFloat(resData.rate);
                this.setState({ rate: rates, zone_cd: resData.zone_cd });
            }
        });
    };

    saveOvertime = async () => {
        this.setState({ isLoading: true });
        const dataTower = this.state.selectedTower;
        const {
            textLot,
            debtorAcct,
            levelNo,
            descsLevel,
            startTime,
            endTime,
            chosenDate,
            totalUsage,
            rate,
            zone_cd,
            selectedOvType
        } = this.state;

        const formData = {
            business_id: await _getData("@UserId"),
            entity: dataTower.entity,
            project_no: dataTower.project,
            ot_Id: 0,
            lotno:
                textLot +
                "-%-" +
                debtorAcct +
                "-%-" +
                levelNo +
                "-%-" +
                descsLevel,
            descs: "Overtime ",
            ov_date: chosenDate,
            over_cd: selectedOvType.over_cd,
            zone_cd: zone_cd,
            startHour: moment(startTime).format("YYYY/MM/DD HH:mm:ss"),
            endHour: moment(endTime).format("YYYY/MM/DD HH:mm:ss"),
            usage: totalUsage,
            trx_amt: totalUsage * rate
        };

        console.log("formData", formData);

        fetch(urlApi + "c_overtime/save/" + dataTower.dbProfile, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                this.setState({ isLoading: false }, () => {
                    this.showAlert(res.Pesan, res.Error);
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ isLoading: false }, () => {
                    this.showAlert("error", true);
                });
            });
    };

    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    handleProjectChange = tower => {
        this.setState(
            {
                selectedTower: {
                    entity: tower.entity_cd,
                    project: tower.project_no,
                    project_descs: tower.project_descs,
                    dbProfile: tower.db_profile
                }
            },
            () => {
                this.getLot();
            }
        );
    };

    handleOvTypeChange = type => {
        this.setState(
            {
                selectedOvType: {
                    over_cd: type.over_cd,
                    descs: type.descs
                }
            },
            () => {
                this.getTrxRate();
            }
        );
    };

    handleDebtorChange = debtor => {
        this.setState({
            textDebtor: debtor.name,
            debtorAcct: debtor.debtor_acct
        });
    };

    handleLotChange = lot => {
        this.setState({
            textLot: lot.lot_no,
            levelNo: lot.level_no,
            descsLevel: lot.descs_level
        });
    };

    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });

        console.log("Selected index", this.state.selectedIndex);
    };

    showPicker = data => {
        this.setState({ [data]: true });
    };
    hidePicker = data => {
        this.setState({ [data]: false });
    };

    handleDateChange = (name, time) => {
        console.log("time", time);
        this.setState({ [name]: time });
    };

    checkUsage = () => {
        const { selectedTower, startTime, endTime } = this.state;

        const data = {
            entity: selectedTower.entity,
            start: moment(startTime).format("DD MMM YYYY HH:mm"),
            end: moment(endTime).format("DD MMM YYYY HH:mm")
        };

        overtimeService.getUsage(data).then(res => {
            console.log("res", res);

            let total = 0;
            res.forEach(item => {
                total = parseFloat(total) + parseFloat(item.UsageHour);
            });

            this.setState({ dataCalculate: res, totalUsage: total }, () => {
                this.refs.modalCalculate.open();
                Navigation.mergeOptions(this.props.componentId, {
                    topBar: {
                        visible: false,
                        drawBehind: true
                    }
                });
            });
        });
    };

    onModalClose = () => {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                visible: true,
                drawBehind: false
            }
        });
    };

    renderContentCalculate = () => {
        const {
            startTime,
            endTime,
            dataCalculate,
            totalUsage,
            rate
        } = this.state;

        const dataHead = [
            {
                label: "Start Overtime ",
                value: ": "+moment(startTime).format("DD MMM YYYY HH:mm")
            },
            {
                label: "End Overtime ",
                value: ": "+moment(endTime).format("DD MMM YYYY HH:mm")
            }
        ];
        return [
            <View style={nbStyles.content__header} key="0">
                <Text style={nbStyles.content__heading}>Detail Overtime</Text>
                {dataHead.map((data,key) => (
                    <View style={{flexDirection : "row",justifyContent : 'space-between'}} key={key}>
                        <Text style={Style.textBlack,Style.textMedium}>{data.label}</Text>
                        <Text style={Style.textBlack,Style.textMedium}>{data.value}</Text>
                    </View>
                ))}
            </View>,

            <View style={nbStyles.content__inside} key="1">
                <FlatList
                    data={dataCalculate}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={nbStyles.flatlist}>
                            <View>
                                <Text style={Style.textBlack}>
                                    {moment(item.OverStartDate).format(
                                        "DD MMM YYYY HH:mm"
                                    )}
                                </Text>
                                <Text style={Style.textBlack}>
                                    {moment(item.OverEndDate).format(
                                        "DD MMM YYYY HH:mm"
                                    )}
                                </Text>
                            </View>
                            <View>
                                <Text style={Style.textBlack}>
                                    {parseFloat(item.UsageHour)}
                                </Text>
                            </View>
                        </View>
                    )}
                />
                <View style={nbStyles.totalUsage}>
                    <Text style={nbStyles.content__subheading}>
                        Total Usage
                    </Text>
                    <Text style={nbStyles.content__subheading}>
                        {totalUsage}
                    </Text>
                </View>
                <View style={nbStyles.totalUsage}>
                    <Text style={nbStyles.content__subheading}>
                        Overtime Amount
                    </Text>
                </View>
                <View style={[nbStyles.totalUsage, { alignSelf: "flex-end" }]}>
                    <Text style={nbStyles.content__subheading}>
                        {`${totalUsage} x Rp. ${numFormat(
                            rate
                        )} = Rp. ${numFormat(totalUsage * rate)}`}
                    </Text>
                </View>
                <View style={nbStyles.subWrap}>
                    <Button
                        block
                        style={[Style.buttonSubmit, { marginTop: 20 }]}
                        onPress={() => this.saveOvertime()}
                    >
                        {this.state.isLoading === false ? (
                            <Text>Submit</Text>
                        ) : (
                            <View style={nbStyles.btnLoadingWrap}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text>Loading...</Text>
                            </View>
                        )}
                    </Button>
                </View>
            </View>
        ];
    };

    showAlert(data, errorkah) {
        Alert.alert(
            "Alert",
            data,
            [
                {
                    text: "OK",
                    onPress: () =>
                        !errorkah
                            ? Navigation.pop(this.props.componentId)
                            : console.log("error")
                }
            ],
            { cancelable: false }
        );
    }

    render() {
        return (
            <Container>
                <OfflineNotice />
                <Content>
                    <View
                        style={nbStyles.wrap}
                        pointerEvents={this.state.isLoading ? "none" : "auto"}
                    >
                        <View style={nbStyles.subWrap}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Text style={nbStyles.title}>Add Overtime</Text>
                            </View>
                        </View>

                        <View style={[nbStyles.subWrap, { marginTop: 10 }]}>
                            <View style={nbStyles.subWrap}>
                                <DropdownInput
                                    label="Project"
                                    data={this.state.dataTower}
                                    onChange={this.handleProjectChange}
                                    value={
                                        this.state.selectedTower.project_descs
                                    }
                                />
                            </View>

                            <View style={nbStyles.subWrap}>
                                <DropdownInput
                                    label="Debtor"
                                    data={this.state.dataDebtor}
                                    onChange={this.handleDebtorChange}
                                    value={this.state.textDebtor}
                                />
                            </View>

                            <View style={nbStyles.subWrap}>
                                <DropdownInput
                                    label="Lot No"
                                    data={this.state.dataLot}
                                    onChange={this.handleLotChange}
                                    value={this.state.textLot}
                                />
                            </View>

                            <View style={nbStyles.subWrap}>
                                <DropdownInput
                                    label="Over Type"
                                    data={this.state.dataOverType}
                                    onChange={this.handleOvTypeChange}
                                    value={this.state.selectedOvType.descs}
                                />
                            </View>

                            <View style={nbStyles.subWrap}>
                                <DateInput
                                    name="startTime"
                                    label="Start Date"
                                    onChange={this.handleDateChange}
                                    value={this.state.startTime}
                                />
                            </View>

                            <View style={nbStyles.subWrap}>
                                <DateInput
                                    name="endTime"
                                    label="End Date"
                                    onChange={this.handleDateChange}
                                    value={this.state.endTime}
                                />
                            </View>
                            <View style={nbStyles.subWrap}>
                                <SubmitInput
                                    title="Calculate"
                                    isLoading={this.state.isLoading}
                                    onPress={() => this.checkUsage()}
                                />
                            </View>
                        </View>
                    </View>
                </Content>

                <Modalize
                    ref={"modalCalculate"}
                    onClosed={this.onModalClose}
                    scrollViewProps={{
                        showsVerticalScrollIndicator: false,
                        stickyHeaderIndices: [0]
                    }}
                >
                    {this.renderContentCalculate()}
                </Modalize>
            </Container>
        );
    }
}
export default AddOvertime;