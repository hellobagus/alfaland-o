import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    StatusBar
} from "react-native";
import { Container, Content, Button } from "native-base";
import nbStyles from "./Style";
import { goToAuth } from "../navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { Navigation } from "react-native-navigation";
import email from "react-native-email";
import RNFetchBlob from "rn-fetch-blob";
import ImagePicker from "react-native-image-crop-picker";
import { Icon as Icons } from "react-native-elements";
import OfflineNotice from "@Component/OfflineNotice";
import { urlApi } from "@Config";
import { sessions } from "../../_helpers";

class Profile extends Component {
    static options(passProps) {
        return {
            topBar: {
                visible: false,
                height: 0
            }
            // statusBar :{
            //     style : 'light',
            //     backgroundColor :'#2c9993',
            // },
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            mounted: false,
            isDisabled: false,

            username: "",
            email: "",
            token: "",
            userId: "",

            fotoProfil: require("@Asset/images/profile.png"),

            dataProfile: [],
            modalVisible: false
        };
        Navigation.events().bindComponent(this);
    }

    async componentWillMount() {
        const data = {
            email: await sessions.getSess("@User"),
            username: await sessions.getSess("@Name"),
            token: await sessions.getSess("@Token"),
            userId: await sessions.getSess("@UserId"),
            mounted: true
        };

        this.setState(data, () => this.getProfile());
    }

    async componentDidAppear() {
        let refresh = await sessions.getSess("@RefreshProfile");
        console.log(refresh);
        if (this.state.mounted) {
            if (refresh === true) {
                sessions.setSess("@RefreshProfile", false);
                this.getProfile();
            }
        }
    }

    componentWillUnmount() {
        this.setState({ mounted: false });
    }

    getProfile = () => {
        fetch(
            urlApi +
                "c_profil/getData/IFCAMOBILE/" +
                this.state.email +
                "/" +
                this.state.userId,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Token: this.state.token
                }
            }
        )
            .then(response => response.json())
            .then(res => {
                const resData = res.Data[0];
                console.log("res", res);

                // ? Agar Gambar Tidak ter cache
                let url =
                    resData.pict + "?random_number=" + new Date().getTime();
                this.setState({ dataProfile: resData }, () => {
                    if (resData.pict) {
                        this.setState({ fotoProfil: { uri: url } });
                    }
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    changePhoto = () => {
        Alert.alert(
            "Select a Photo",
            "Choose the place where you want to get a photo",
            [
                { text: "Gallery", onPress: () => this.fromGallery() },
                { text: "Camera", onPress: () => this.fromCamera() },
                {
                    text: "Cancel",
                    onPress: () => console.log("User Cancel"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    };

    fromCamera() {
        ImagePicker.openCamera({
            cropping: true,
            width: 100,
            height: 100
        })
            .then(image => {
                console.log("received image", image);

                this.setState({ fotoProfil: { uri: image.path } }, () =>
                    this.uploadPhoto()
                );
            })
            .catch(e => console.log("tag", e));
    }

    fromGallery(cropping, mediaType = "photo") {
        ImagePicker.openPicker({
            multiple: false,
            width: 100,
            height: 100
        })
            .then(image => {
                console.log("received image", image);

                this.setState({ fotoProfil: { uri: image.path } }, () =>
                    this.uploadPhoto()
                );
            })
            .catch(e => console.log("tag", e));
    }

    uploadPhoto = async () => {
        let fileName = "profile.png";
        let fileImg = RNFetchBlob.wrap(
            this.state.fotoProfil.uri.replace("file://", "")
        );

        RNFetchBlob.fetch(
            "POST",
            urlApi + "/c_profil/upload/" + this.state.email,
            {
                "Content-Type": "multipart/form-data",
                Token: this.state.token
            },
            [{ name: "photo", filename: fileName, data: fileImg }]
        ).then(resp => {
            let res = JSON.stringify(resp.data);
            this.refreshPhoto();
        });
    };

    refreshPhoto = async () => {
        sessions.setSess("@RefreshProfile", "true");
    };

    btnLogout = () => {
        fetch(urlApi + "c_auth/Logout/IFCAPB", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Token: this.state.token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    this.logout();
                } else {
                    Alert.alert(res.Pesan);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    logout = async () => {
        try {
            await sessions.destroySess();
            goToAuth();
        } catch (err) {
            console.log("error signing out...: ", err);
        }
    };

    showAlertLogout(title, body) {
        Alert.alert(
            title,
            body,
            [
                { text: "Cancel" },
                { text: "Logout", onPress: () => this.btnLogout() }
            ],
            { cancelable: false }
        );
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    handleNavigation = (screenName, passedProps) => {
        this.setState({ isDisabled: true }, () => {
            this.goToScreen(screenName, passedProps);
        });
    };

    goToScreen = (screenName, passedProps) => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
                passProps: {
                    passed: passedProps,
                    token: this.state.token
                }
            }
        });
    };

    componentDidDisappear() {
        this.setState({ isDisabled: false });
    }

    handleEmail = () => {
        const to = ["bagustrinanda@yahoo.com", "nandatribagus@gmail.com"]; // string or array of email addresses
        email(to, {
            // Optional additional arguments
            cc: ["bazzy@moo.com", "doooo@daaa.com"], // string or array of email addresses
            bcc: "mee@mee.com", // string or array of email addresses
            subject: "Show how to use",
            body: "Some body right here"
        }).catch(console.error);
    };

    render() {
        const data = this.state.dataProfile;
        return (
            <Container>
                <ImageBackground
                    source={require("@Asset/images/profilebg.png")}
                    style={{ flex: 1, resizeMode: "cover" }}
                >
                    <OfflineNotice />

                    <Content>
                        <View style={nbStyles.Wrap}>
                            <Text style={nbStyles.headerText}>Profile</Text>
                            <TouchableOpacity
                                disabled={this.state.isDisabled}
                                transparent
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-evenly"
                                }}
                                onPress={() =>
                                    this.handleNavigation(
                                        "screen.EditProfile",
                                        this.state.dataProfile
                                    )
                                }
                            >
                                <Icon name="cog" style={nbStyles.icon}></Icon>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        color: "#fff"
                                    }}
                                >
                                    {" "}
                                    Settings
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <View style={nbStyles.imageWrap}>
                                <View style={nbStyles.images}>
                                    <Image
                                        source={this.state.fotoProfil}
                                        style={nbStyles.image}
                                    />
                                </View>
                                <Icons
                                    name={"edit"}
                                    color="#42C8C2"
                                    containerStyle={nbStyles.iconRemove}
                                    onPress={() => this.changePhoto()}
                                />
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <Text style={nbStyles.labelText}>Username</Text>
                            <Text style={nbStyles.contentText}>
                                {data.name}
                            </Text>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <Text style={nbStyles.labelText}>Email</Text>
                            <Text style={nbStyles.contentText}>
                                {data.email}
                            </Text>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <Text style={nbStyles.labelText}>Telepon</Text>
                            <Text style={nbStyles.contentText}>
                                {data.Handphone}
                            </Text>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <TouchableOpacity
                                style={nbStyles.btnOrange}
                                onPress={() => this.handleEmail()}
                            >
                                <Text style={nbStyles.buttonText}>
                                    Send Email
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={nbStyles.subWrap}>
                            {/* this.showAlertLogout('Alert','Do you want to logout ?') */}
                            <TouchableOpacity
                                onPress={() => this.setModalVisible(true)}
                            >
                                <Text style={nbStyles.buttonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </ImageBackground>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() =>
                        this.setModalVisible(!this.state.modalVisible)
                    }
                >
                    <View style={nbStyles.modalView}>
                        <View style={nbStyles.modalContainer}>
                            <View style={nbStyles.modalHeader}>
                                <Text style={nbStyles.textModal}>
                                    Logout from IFCA O+
                                </Text>
                                <TouchableOpacity
                                    style={{ width: 100, height: 100 }}
                                    onPress={() =>
                                        this.setModalVisible(
                                            !this.state.modalVisible
                                        )
                                    }
                                >
                                    <Icon
                                        style={nbStyles.iconModal}
                                        name="times"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={nbStyles.modalBody}>
                                <Text style={nbStyles.subTitleModal}>
                                    Are you sure for logout ?
                                </Text>
                                <View style={nbStyles.btnWrapModal}>
                                    <TouchableOpacity
                                        style={nbStyles.btnNo}
                                        onPress={() =>
                                            this.setModalVisible(
                                                !this.state.modalVisible
                                            )
                                        }
                                    >
                                        <Text style={nbStyles.textNo}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={nbStyles.btnYes}
                                        onPress={() => this.btnLogout()}
                                    >
                                        <Text style={nbStyles.textYes}>
                                            Logout
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Container>
        );
    }
}
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});
