import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    Platform,
    Image,
    Alert,
    SafeAreaView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
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
    Body,
    Thumbnail
} from "native-base";
import nbStyles from "./Style";
import Style from "@Theme/Style";
import DeviceInfo from "react-native-device-info";
import { goHome } from "../navigation";
import firebase from "react-native-firebase";
import { USER_KEY } from "../config";
import OfflineNotice from "@Component/OfflineNotice";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config";
import { authService, productService } from "../../_services";
import { nav, sessions } from "../../_helpers";

class Login extends Component {
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
            isHidden: true,

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
            passwordError: "",

            data: []
        };
    }

    onChangeText = (key, value) => {
        this.setState({ [key]: value });
    };

    async componentDidMount() {
        this.setState({ device: Platform.OS });

        this.checkPermission();
        this.createNotificationListeners();
    }

    btnLoginClick = async () => {
        const mac = await DeviceInfo.getMACAddress().then(mac => {
            return mac;
        });
        const formData = {
            email: this.state.emailTextInput,
            password: this.state.passwordTextInput,
            token: "",
            token_firebase: this.state.token,
            device: this.state.device,
            mac: mac,
            app: "O"
        };
        var lengthPass = this.state.passwordTextInput.length;
        if (lengthPass < 4) {
            alert("Wrong password !!!");
        } else {
            this.doLogin(formData);
        }
    };

    async doLogin(value) {
        this.setState({ showSpinner: !this.state.showSpinner });

        await authService.login(value).then(res => {
            if (!res.Error) {
                if (!res.Data.isResetPass == 1) {
                    this.getTower(res);
                } else {
                    nav.push(this.props.componentId, "screen.ChangePass", {
                        email: res.Data.user
                    });
                }
            } else {
                alert(res.Pesan);
            }
        });
    }

    getTower = async rest => {
        let result = rest.Data;
        const data = {
            email: this.state.emailTextInput,
            app: "O"
        };

        await productService.getTower(data).then(res => {
            if (res.Error === false) {
                let resData = res.Data;
                result["UserProject"] = resData;
                this.signIn(result);
                console.log("resDataTower", resData);
            }
        });
    };

    signIn = async res => {
        const { emailTextInput, passwordTextInput } = this.state;
        try {
            sessions.setSess("@UserId", res.UserId);
            sessions.setSess("@Name", res.name);
            sessions.setSess("@Token", res.Token);
            sessions.setSess("@User", res.user);
            sessions.setSess("@Group", res.Group);
            sessions.setSess("@isLogin", true);
            sessions.setSess("@isReset", res.isResetPass);
            sessions.setSess("@AgentCd", res.AgentCd);
            sessions.setSess("@Debtor", res.Debtor_acct);
            sessions.setSess("@rowID", res.rowID);
            sessions.setSess("@RefreshProfile", false);
            sessions.setSess("@UserProject", res.UserProject);

        } catch (err) {
            console.log("error:", err);
        } finally{
            setTimeout(() => {
                goHome();
            }, 1000);
        }
    };

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

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {
        let fcmToken = await AsyncStorage.getItem("fcmToken");
        // console.log('fcmToken', fcmToken);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem("token", fcmToken);
                console.log("fcmToken", fcmToken);
                this.setState({
                    token: fcmToken
                });
            }
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log("permission rejected");
        }
    }

    async createNotificationListeners() {
        firebase.notifications().setBadge(0);
        this.notificationListener = firebase
            .notifications()
            .onNotification(notification => {
                const { title, body } = notification;
                this.showAlert(title, body);
            });

        this.notificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened(notificationOpen => {
                const { title, body } = notificationOpen.notification;
                this.showAlert(title, body);
            });

        const notificationOpen = await firebase
            .notifications()
            .getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }

        this.messageListener = firebase.messaging().onMessage(message => {
            console.log(JSON.stringify(message));
        });
    }

    handleEyeChanger = () => {
        this.setState({ isHidden: !this.state.isHidden }, () => {
            this.refs["password"].blur();
        });
    };

    showAlert(title, body) {
        Alert.alert(
            title,
            body,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
        );
    }
    render() {
        return (
            <Container style={nbStyles.content}>
                <ImageBackground
                    source={require("@Img/bg-login/loginbg2.png")}
                    style={{ flex: 1, resizeMode: "cover" }}
                >
                    {/* {this.renderHeader()} */}
                    <OfflineNotice />
                    <SafeAreaView>
                        <View style={Style.LogoLeftTopWarp}>
                            <Image
                                style={{ height: 48, width: 150 }}
                                source={require("@Asset/images/logo-login/alfaland-logo2.png")}
                            />
                        </View>

                        <View style={nbStyles.wrap}>
                            <View>
                                <Text style={nbStyles.title}>Login</Text>
                            </View>
                            <View style={nbStyles.textInputWrap}>
                                <TextInput
                                    style={nbStyles.textInput}
                                    placeholder={"Email Address"}
                                    onChangeText={val =>
                                        this.onChangeText("emailTextInput", val)
                                    }
                                />
                            </View>
                            <View
                                style={[
                                    nbStyles.textInputWrap,
                                    {
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }
                                ]}
                            >
                                <TextInput
                                    ref="password"
                                    style={nbStyles.textInput}
                                    placeholder={"Password"}
                                    secureTextEntry={this.state.isHidden}
                                    onChangeText={val =>
                                        this.onChangeText(
                                            "passwordTextInput",
                                            val
                                        )
                                    }
                                />
                                <Icon
                                    onPress={() => this.handleEyeChanger()}
                                    active
                                    name={
                                        this.state.isHidden ? "eye" : "eye-off"
                                    }
                                    type="MaterialCommunityIcons"
                                    style={nbStyles.EyePasswordBtnIcon}
                                />
                            </View>
                            <View style={nbStyles.subWrap1}>
                                <Button
                                    style={nbStyles.btnGreenAlfa}
                                    onPress={this.btnLoginClick}
                                >
                                    <Text style={nbStyles.loginBtnText}>
                                        {"Login".toUpperCase()}
                                    </Text>
                                    <Icon
                                        active
                                        name="arrow-right"
                                        type="MaterialCommunityIcons"
                                        style={nbStyles.loginBtnIcon}
                                    />
                                </Button>
                            </View>
                            {/* <View>
                            <Text style={nbStyles.subTitle}>OR</Text>
                        </View>
                        <View style={nbStyles.subWrap2}>
                            <Button style={nbStyles.btnBlue} >
                                <Text style={nbStyles.loginBtnText}>{'Login With Facebook'.toUpperCase()}</Text>
                                <Icon active name='arrow-right' type="MaterialCommunityIcons" style={nbStyles.loginBtnIcon} />
                            </Button>
                        </View> */}
                        </View>
                    </SafeAreaView>
                </ImageBackground>
            </Container>
        );
    }
}
export default Login;
