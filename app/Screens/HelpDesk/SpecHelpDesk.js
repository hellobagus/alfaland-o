import React, { Component } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Container, Content, Text, Button } from "native-base";
import nbStyles from "./Style";
import Spinner from "react-native-loading-spinner-overlay";
import ModalSelector from "react-native-modal-selector";
import Style from "@Theme/Style";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { CheckBox } from "react-native-elements";
import { Navigation } from "react-native-navigation";
import Title from "@Component/Title";
import SubTitle from "@Component/SubTitle";
import OfflineNotice from "@Component/OfflineNotice";
import {
    SubmitInput,
    DropdownInput,
    NormalInput
} from "../../components/Input";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config";

class SpecHelpDesk extends Component {
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
            isDisabled: false,
            rowId: "",
            email: "",
            business_id: "",
            debtor: "",
            entity: "",
            project: "",
            audit_user: "",
            db_profile: "",

            ticketNo: 0,
            seqNo: 0,
            comSource: 0,

            selectedIndex: 0,
            typeTicket: "C",
            appType: "",

            dataTower: [],
            dataDebtor: [],
            dataLot: [],
            dataApplicationType: [],

            textUsername: "",
            textDebtor: "",
            textLot: "",
            textContact: "",
            textAppType: "",
            textFloor: "",
            token: "",
            isValid: "",

            checked: false,
            spinner: false
        };

        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    async componentDidMount() {
        this._isMount = true;

        const datas = {
            textUsername: await _getData("@Name"),
            audit_user: await _getData("@Name"),
            email: await _getData("@User"),
            debtor: await _getData("@Debtor"),
            business_id: await _getData("@UserId"),
            rowId: await _getData("@rowID"),
            dataTower: await _getData("@UserProject"),
            token: await _getData("@Token")
        };

        this.loadData(datas);
    }

    loadData = datas => {
        if (this._isMount) {
            this.setState(datas);
        }
    };

    componentWillUnmount() {
        this._isMount = false;
    }


    validating = validationData => {
        const keys = Object.keys(validationData);
        const errorKey = [];
        let isValid = false;

        keys.map((data, key) => {
            if (validationData[data].require) {
                let isError =
                    !this.state[data] || this.state[data].length == 0
                        ? true
                        : false;
                let error = "error" + data;
                errorKey.push(isError);
                this.setState({ [error]: isError });
            }
        });

        for (var i = 0; i < errorKey.length; i++) {
            if (errorKey[i]) {
                isValid = false;
                break;
            }
            isValid = true;
        }

        return isValid;
    };

    getApplicationType = () => {
        fetch(
            urlApi +
                "c_ticket_entry/getApplicationType/" +
                this.state.db_profile,
            {
                method: "GET",
                headers: new Headers({
                    Token: this.state.token
                })
            }
        )
            .then(response => response.json())
            .then(res => {
                this.setState({ dataApplicationType: [] });
                if (res.Error === false) {
                    let resData = res.Data;
                    if (this._isMount) {
                        this.setState({ dataApplicationType: resData });
                    }
                }
            })
            .catch(error => {
                if (this._isMount) {
                    this.setState({ spinner: false });
                }
                console.log(error);
            });
    };

    getTicketNo = () => {
        const dT = this.state.dataTower[0];

        const formData = {
            entity: dT.entity_cd,
            project: dT.project_no
        };

        fetch(urlApi + "c_ticket_entry/getTicketNo/" + this.state.db_profile, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    let resData = res.Data;
                    if (this._isMount) {
                        this.setState({ ticketNo: resData });
                    }
                }
            })
            .catch(error => {
                this.setState({ spinner: false });
                console.log(error);
            });
    };

    getSeqNo = () => {
        const dT = this.state.dataTower[0];

        const formData = {
            entity: dT.entity_cd,
            project: dT.project_no
        };

        fetch(
            urlApi + "c_ticket_entry/getSeqNoTicket/" + this.state.db_profile,
            {
                method: "POST",
                body: JSON.stringify(formData)
            }
        )
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    let resData = res.Data;
                    if (this._isMount) {
                        this.setState({ seqNo: resData });
                    }
                    // console.log('response', resData)
                }
            })
            .catch(error => {
                this.setState({ spinner: false });
                console.log(error);
            });
    };

    getComSource = () => {
        const dT = this.state.dataTower[0];

        const formData = {
            entity: dT.entity_cd,
            project: dT.project_no
        };

        fetch(urlApi + "c_ticket_entry/getComsource/" + this.state.db_profile, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    let resData = res.Data;
                    if (this._isMount) {
                        this.setState({ comSource: resData });
                    }
                }
            })
            .catch(error => {
                this.setState({ spinner: false });
                console.log(error);
            });
    };

    getDebtor = data => {
        const dT = data;

        const formData = {
            entity: dT.entity_cd,
            project: dT.project_no,
            email: this.state.email
        };

        fetch(urlApi + "c_ticket_entry/getDebtor/" + dT.db_profile, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    let resData = res.Data;
                    if (this._isMount) {
                        this.setState({ dataDebtor: resData, spinner: false });
                    }
                }
                console.log("Debtor", res);
            })
            .catch(error => {
                this.setState({ spinner: false });
                console.log(error);
            });
    };

    getLot = () => {
        const { entity, project, textDebtor, business_id, email } = this.state;

        const formData = {
            entity: entity,
            project: project,
            debtor: textDebtor,
            business_id: business_id,
            email: email
        };

        fetch(urlApi + "c_ticket_entry/getLotno/IFCAPB", {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    console.log("ResData", JSON.stringify(res.Data));
                    let resData = res.Data;

                    if (this._isMount) {
                        this.setState({ dataLot: resData, spinner: false });
                    }
                }
            })
            .catch(error => {
                this.setState({ spinner: false });
                console.log(error);
            });
    };

    getFloor = () => {
        const dT = this.state.textLot;

        const formData = {
            lotno: dT
        };

        fetch(urlApi + "c_ticket_entry/getFloor/IFCAPB", {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    const resData = JSON.stringify(res.Data);
                    if (this._isMount) {
                        this.setState({ textFloor: resData });
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleLotChange = lot => {
        this.setState({ textLot: lot });
        this.getFloor();
    };

    handleCheckChange = (index, data) => {
        this.setState(
            {
                checked: index,
                entity: data.entity_cd,
                project: data.project_no,
                db_profile: data.db_profile
            },
            () => {
                this.getDebtor(data);
                this.getApplicationType();
                this.getTicketNo();
                this.getSeqNo();
                this.getComSource();
            }
        );

        console.log("daa", data);
    };

    handleChangeModal = data => {
        console.log("dataDeb", data);
        this.setState(
            {
                debtor: data.debtor_acct,
                textDebtor: data.name,
                spinner: true
            },
            () => {
                this.getLot(data.debtor_acct);
            }
        );
    };

    handleChangeApplicationType = data => {
        console.log("dataDebs", data);
        this.setState({
            appType: data.category_cd,
            textAppType: data.descs
        });
    };

    handleIndexChange = index => {
        let type = "";
        if (index == 0) {
            type = "C";
        } else if (index == 1) {
            type = "R";
        } else if (index == 2) {
            type = "A";
        }

        this.setState({
            ...this.state,
            selectedIndex: index,
            typeTicket: type,
            appType: "",
            textAppType: ""
        });

        console.log("Selected index", this.state.selectedIndex);
    };

    handleNavigation = () => {
        this.setState({ isDisabled: true }, () => {
            const isValid = this.validating({
                textContact: { require: true },
                email: {require: true},
                hp: { require: true},
                code: { require: true}
              
            })
            if (isValid && this.state.appType == "") {
                this.goToScreen("screen.CategoryHelp");
            } else {
                this.goToScreen("screen.SubmitHelpDesk");
            }
        });
    };

    goToScreen = screenName => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
                passProps: {
                    prevProps: this.state
                }
            }
        });
    };

    componentDidDisappear() {
        this.setState({ isDisabled: false });
    }

    render() {
        let index = 0;
        const data = [];
        this.state.dataDebtor.map((data, key) => (data = data));

        return (
            <Container>
                <OfflineNotice />
                <Content>
                    <View>
                        <Spinner visible={this.state.spinner} />
                    </View>

                    <View style={nbStyles.wrap}>
                        <Title text="Ticket" />
                        <SubTitle text="Specification Help Desk" />
                        <View style={nbStyles.subWrap}>
                            <SegmentedControlTab
                                values={["Complain", "Request"]}
                                selectedIndex={this.state.selectedIndex}
                                onTabPress={this.handleIndexChange}
                                activeTabStyle={nbStyles.activeTabStyle}
                                activeTabTextStyle={nbStyles.activeTabTextStyle}
                                tabStyle={nbStyles.tabStyle}
                                tabTextStyle={nbStyles.tabTextStyle}
                            />
                            <View style={nbStyles.subWrap2}>
                                {this.state.dataTower.map((data, key) => (
                                    <CheckBox
                                        key={key}
                                        checkedIcon="dot-circle-o"
                                        uncheckedIcon="circle-o"
                                        title={data.project_descs}
                                        checked={this.state.checked === key}
                                        onPress={() =>
                                            this.handleCheckChange(key, data)
                                        }
                                    />
                                ))}
                            </View>
                            {/* SELECT TAB OPTION IN HERE */}

                            {/* SELECTED TAB COMPLAIN */}
                            {this.state.selectedIndex === 0 && (
                                <View style={nbStyles.subWrap}>
                                    <DropdownInput
                                        label="Debtor"
                                        data={this.state.dataDebtor}
                                        onChange={this.handleChangeModal}
                                        value={this.state.textDebtor}
                                    />

                                    <NormalInput
                                        label="Name"
                                        // value={this.state.textUsername}
                                        onChangeText={text =>
                                            this.setState({
                                                textUsername: text
                                            })
                                        }
                                    />

                                    <DropdownInput
                                        label="Lot No"
                                        data={this.state.dataLot}
                                        onChange={option =>
                                            this.handleLotChange(option.lot_no)
                                        }
                                        value={this.state.textLot}
                                    />

                                    <NormalInput
                                        label="Contact No"
                                        value={this.state.textContact}
                                        onChangeText={text =>
                                            this.setState({
                                                textContact: text
                                            })
                                        }
                                    />
                                </View>
                            )}
                            {/* END TAB COMPLAIN */}

                            {/* SELECTED TAB REQUEST */}
                            {this.state.selectedIndex === 1 && (
                                <View style={nbStyles.subWrap}>
                                    <DropdownInput
                                        label="Debtor"
                                        data={this.state.dataDebtor}
                                        onChange={this.handleChangeModal}
                                        value={this.state.textDebtor}
                                    />

                                    <NormalInput
                                        label="Username"
                                        value={this.state.textUsername}
                                        onChangeText={text =>
                                            this.setState({
                                                textUsername: text
                                            })
                                        }
                                    />

                                    <DropdownInput
                                        label="Lot No"
                                        data={this.state.dataLot}
                                        onChange={option =>
                                            this.handleLotChange(option.lot_no)
                                        }
                                        value={this.state.textLot}
                                    />
                                    <NormalInput
                                        label="Contact No"
                                        value={this.state.textContact}
                                        keyboardType="number-pad"
                                        onChangeText={text =>
                                            this.setState({
                                                textContact: text
                                            })
                                        }
                                    />
                                </View>
                            )}
                            {/* END TAB REQUEST */}

                            {/* SELECTED TAB APPLICATION */}
                            {this.state.selectedIndex === 2 && (
                                <View style={nbStyles.subWrap}>
                                    <DropdownInput
                                        label="Application Type"
                                        data={this.state.dataApplicationType}
                                        onChange={
                                            this.handleChangeApplicationType
                                        }
                                        value={this.state.textAppType}
                                    />
                                    <NormalInput
                                        label="Username"
                                        value={this.state.textUsername}
                                        onChangeText={text =>
                                            this.setState({
                                                textUsername: text
                                            })
                                        }
                                    />
                                    <DropdownInput
                                        label="Debtor"
                                        data={this.state.dataDebtor}
                                        onChange={this.handleChangeModal}
                                        value={this.state.textDebtor}
                                    />
                                    <DropdownInput
                                        label="Lot No"
                                        data={this.state.dataLot}
                                        onChange={option =>
                                            this.handleLotChange(option.lot_no)
                                        }
                                        value={this.state.textLot}
                                    />
                                    <NormalInput
                                        label="Contact No"
                                        value={this.state.textContact}
                                        keyboardType="number-pad"
                                        onChangeText={text =>
                                            this.setState({
                                                textContact: text
                                            })
                                        }
                                    />
                                     {this.state.errortextContact ? (<Text
                                style={{
                                    position: "absolute",
                                    bottom:10,
                                    left: 15,
                                    color: "red",
                                    fontSize: 12
                                }}
                            >
                                Full Name Required
                            </Text>) : null}
                                    
                                    

                                </View>
                            )}
                            {/* END TAB APPLICATION */}

                            {/* SELECTED TAB END */}
                        </View>

                        <View style={nbStyles.subWrap}>
                            <Button
                                block
                                style={Style.buttonSubmit}
                                onPress={() => this.handleNavigation()}
                                disabled={this.state.isDisabled}
                            >
                                <Text>Next</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default SpecHelpDesk;

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
    }
});
