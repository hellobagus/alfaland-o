import React, { Component } from "react";
import { View, ImageBackground, Image, Alert } from "react-native";
import { Container, Content, Text, Button, Icon, Header } from "native-base";
import nbStyles from "./Style";
import Style from "@Theme/Style";
import OfflineNotice from "@Component/OfflineNotice";
import { nav } from "../../_helpers";
import { authService } from "../../_services";
import { PasswordInput } from "../../components/Input";
class ChangePass extends Component {
    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: "Change Password",
                    fontFamily: "Montserrat-SemiBold"
                },
                background: {
                    color: "transparent",
                    translucent: true,
                    transparent: true
                },
                elevation: 0,
                drawBehind: true
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
            newPassword: "",
            conPassword: ""
        };

        console.log("props", props);
    }

    onChangeValue = (name, value) => {
        this.setState({ [name]: value });
    };

    doReset = async () => {
        const { newPassword, conPassword } = this.state;
        const data = {
            email: this.props.email,
            newpass: newPassword
        };

        newPassword === conPassword
            ? await authService.changePass(data).then(res => {
                  this.showAlert("Success", res.Pesan);
                  !res.Error && nav.pop(this.props.componentId);
              })
            : this.showAlert("Error", "Your password doesn't match");
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
                    <View style={Style.LogoLeftTopWarp}>
                        <Image
                            style={{ height: 48, width: 150 }}
                            source={require("@Asset/images/logo-login/alfaland-logo2.png")}
                        />
                    </View>
                    <Content>
                        <View style={nbStyles.wrap}>
                            <PasswordInput
                                name={"newPassword"}
                                placeholder={"New Password"}
                                onChanges={this.onChangeValue}
                                value={this.state.newPassword}
                            />
                            <PasswordInput
                                name={"conPassword"}
                                placeholder={"Confirm Password"}
                                onChanges={this.onChangeValue}
                                value={this.state.conPassword}
                            />

                            <View style={nbStyles.subWrap1}>
                                <Button
                                    style={nbStyles.btnGreenAlfa}
                                    onPress={this.doReset}
                                >
                                    <Text style={nbStyles.loginBtnText}>
                                        {"SAVE".toUpperCase()}
                                    </Text>
                                    <Icon
                                        active
                                        name="arrow-right"
                                        type="MaterialCommunityIcons"
                                        style={nbStyles.loginBtnIcon}
                                    />
                                </Button>
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}
export default ChangePass;
