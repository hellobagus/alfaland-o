import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    Platform,
    Image
} from "react-native";
import {
    Container,
    Content,
    Text,
    Badge,
    Form,
    Item,
    Label,
    Input,
    Button,
    Icon,
    Header,
    Left,
    Body
} from "native-base";
import { Navigation } from "react-native-navigation";
import nbStyles from "./Style";
import Style from "@Theme/Style";
import OfflineNotice from "@Component/OfflineNotice";
import { nav } from "../../_helpers";
import {urlApi} from '@Config';

class Reset extends Component {
    static options(passProps) {
        return {
            topBar: {
                visible: false,
                height: 0
            },
            bottomTabs: {
                visible: false,
                drawBehind: true
            }
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            //This below for Control
            icEye: "visibility-off",
            avPassword: true,
            device: "",
            token: "",
            isCorrect: "",
            showSpinner: false,

            //This below for form text
            passwordTextInput: "",
            emailTextInput: "",

            // This below for Alert
            showAlert: false,
            themeAlert: "info",
            titleAlert: "",
            subtitleAlert: "",
            titleButtonAlert: "Close",

            // This below for Validator
            emailError: "",
            passwordError: ""
        };
    }

    async componentDidMount() {
        if (Platform.OS === "android") {
            // this.setState({device:Platform.OS})
        } else if (Platform.OS === "ios") {
            // Alert.alert('This is iOS');
        }
        this.setState({ device: Platform.OS });
    }

    btnLoginClick = () => {
        const formData = {
            email: this.state.emailTextInput,
            password: this.state.passwordTextInput,
            token: "",
            device: this.state.device
        };
        var lengthPass = this.state.passwordTextInput.length;
        if (lengthPass < 4) {
            this.setState({ isCorrect: false, titleButtonAlert: "Try Again" });
        } else {
            this.doLogin(formData);
        }
    };

    async doLogin(value) {
        this.setState({ showSpinner: !this.state.showSpinner });
        data = JSON.stringify(value);

        fetch(urlApi+"c_auth/Login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: data
        })
            .then(response => response.json())
            .then(res => {
                alert("Berhasil Horee");
                console.log("errorkah", res);
            })
            .catch(error => {
                console.error(error);
            });
    }

    renderHeader() {
        return (
            <Header style={Style.navigationTransparent}>
                <View style={Style.actionBarLeft}>
                    <Button
                        transparent
                        style={Style.actionBarBtn}
                        onPress={() => {
                            nav.pop(this.props.componentId);
                        }}
                    >
                        <Icon
                            active
                            name="arrow-left"
                            style={Style.textWhite}
                            type="MaterialCommunityIcons"
                        />
                    </Button>
                </View>
            </Header>
        );
    }
    render() {
        return (
            <Container style={nbStyles.content}>
                <ImageBackground
                    source={require("@Img/loginbg.png")}
                    style={{ flex: 1, resizeMode: "cover" }}
                >
                    <OfflineNotice />
                    {this.renderHeader()}
                    <View style={Style.LogoLeftTopWarp}>
                        <Image source={require("@Asset/images/logo.png")} />
                    </View>
                    <View style={nbStyles.wrap}>
                        <View>
                            <Text style={nbStyles.title}>Reset Password</Text>
                        </View>
                        <View>
                            <Text style={nbStyles.subTitle}>
                                Using this feature will be resetting your
                            </Text>
                            <Text style={nbStyles.subTitle}>
                                current password. Make sure entered email
                            </Text>
                            <Text style={nbStyles.subTitle}>
                                is related to your IFCA 0+ account
                            </Text>
                        </View>
                        <View style={nbStyles.subWrap2}>
                            <View style={nbStyles.textInputWrap}>
                                <TextInput
                                    style={nbStyles.textInput}
                                    placeholder={"Email"}
                                    onChangeText={text => {
                                        this.setState({ emailTextInput: text });
                                    }}
                                />
                            </View>
                        </View>
                        <View style={nbStyles.subWrap1}>
                            <Button
                                style={nbStyles.btnYellow}
                                onPress={this.btnLoginClick}
                            >
                                <Text style={nbStyles.loginBtnText}>
                                    {"Reset Password".toUpperCase()}
                                </Text>
                                <Icon
                                    active
                                    name="arrow-right"
                                    type="MaterialCommunityIcons"
                                    style={nbStyles.loginBtnIcon}
                                />
                            </Button>
                        </View>
                        <View style={nbStyles.rowWarp}>
                            <Text style={nbStyles.subTitle1}>
                                Have an account ?
                            </Text>
                            <View style={nbStyles.btnRow}>
                                <TouchableOpacity onPress={()=>nav.push(this.props.componentId,"screen.Login")}>
                                    <Text style={Style.textOrange}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}
export default Reset;
