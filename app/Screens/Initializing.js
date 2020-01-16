import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ImageBackground
} from "react-native";
import { goToAuth, goHome } from "./navigation";
import AsyncStorage from "@react-native-community/async-storage";
import { sessions } from "../_helpers";

import { USER_KEY } from "./config";
class Initializing extends Component {
    async componentDidMount() {
        try {
            const user = await sessions.getSess("@isLogin");
            console.log("user: ", user);
            if (user) {
                setTimeout(() => {
                    goHome();
                }, 1000);
            } else {
                setTimeout(() => {
                    goToAuth();
                }, 1000);
            }
        } catch (err) {
            console.log("error: ", err);
            setTimeout(() => {
                goToAuth();
            }, 1000);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require("@Img/bg-login/loginbg2.png")}
                    style={styles.background}
                >
                    <ActivityIndicator size="large" color="#00AFF0" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </ImageBackground>
            </View>
        );
    }
}
export default Initializing;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 17,
        fontWeight: "300"
    }
});
