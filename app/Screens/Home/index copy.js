import React, { Component } from "react";
import {
    ScrollView,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Platform,
    RefreshControl,
    Animated
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
    Container,
    Content,
    Text,
    Thumbnail,
    H3,
    Button,
    Header,
    Left,
    Right,
    Title,
    Body,
    Card,
    Icon
} from "native-base";
import numFormat from "@Component/numFormat";
import CategoryMenu from "@Component/Home/Category/CategoryMenu";
import News from "@Component/Home/Category/News";
import { Navigation } from "react-native-navigation";
import { USER_KEY } from "../config";
const { height, width } = Dimensions.get("window");
import OfflineNotice from "@Component/OfflineNotice";
import Style from "../../Theme/Style";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config";

HEADER_MAX_HEIGHT = 100;
HEADER_MIN_HEIGHT = 25;
PROFILE_IMAGE_MAX_HEIGHT = 80;
PROFILE_IMAGE_MIN_HEIGHT = 40;

class Home extends React.Component {
    static options(passProps) {
        const isIos = Platform.OS === "ios";

        return {
            topBar: {
                visible: false,
                // height : 0,
                drawBehind: true,
                background: {
                    color: "#333"
                }
            },
            statusBar: {
                style: isIos ? "dark" : "light",
                backgroundColor: "#008bbf"
            }
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            isDisable: false,
            name: "HelloBagus",
            totalInvoice: 999,
            totalInvoiceDue: "999.999.999.00",
            dateNow: 0,
            token: "",

            mounted: false,
            fotoProfil: require("@Asset/images/profile.png"),

            username: "",
            dash: [],
            dataNews: [],
            dataTower: [],
            dataProfile: [],

            scrollY: new Animated.Value(0)
        };

        Navigation.events().bindComponent(this);
    }

    async componentWillMount() {
        this.startHeaderHeight = 150;
        if (Platform.OS == "android") {
            this.startHeaderHeight = 100 + StatusBar.currentHeight;
        }

        const data = {
            email: await _getData("@User"),
            name: await _getData("@Name"),
            token: await _getData("@Token"),
            userId: await _getData("@UserId"),

            mounted: true
        };

        console.log("data", data);

        this.setState(data, () => {
            this.getInvoice();
            this.getTower();
            this.getProfile();
        });
    }

    async componentDidAppear() {
        let refresh = await _getData("@RefreshProfile");
        if (this.state.mounted) {
            if (refresh) {
                _storeData("@RefreshProfile", false);
                this.getProfile();
            }
        }
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

                // ? Agar Gambar Tidak ter cache
                let url =
                    resData.pict + "?random_number=" + new Date().getTime();
                this.setState({
                    dataProfile: resData,
                    fotoProfil: { uri: url }
                });
            })
            .catch(error => {
                console.log(error);
            });
    };

    getInvoice = async () => {
        fetch(urlApi + "c_dashboard/getInvoice/" + this.state.email, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Token: this.state.token
            }
        })
            .then(response => response.json())
            .then(res => {
                const Data = res;
                const inv = Data.totalInvoice;
                const invDue = Data.totalInvoiceDue;
                this.setState(
                    {
                        totalInvoice: inv,
                        totalInvoiceDue: invDue,
                        dateNow: Data.dateNow
                    },
                    () => {
                        _storeData("@TotalInvoiceDue", invDue);
                    }
                );
                this.setState({ refreshing: false });
            })
            .catch(error => {
                console.log(error);
            });
    };
    getTower = () => {
        let email = this.state.email;

        fetch(urlApi + "c_product_info/getData/IFCAMOBILE/" + email, {
            method: "GET",
            headers: new Headers({
                Token:
                    "JXmiUMx0+cg40ee5SU8Jc6xDKP7/XIfsTPjp1PdlLWptSTq/aaEJvTCTx4S98QeJdetlqFj2VbI+D6PqELUuk+5ZxxvS8ujvUdz0CqAS::268e8fa2a99a1dda0bae16f556d6403e"
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error === false) {
                    this.setState({ dataTower: [] });
                    let resData = res.Data;
                    this.setState({ dataTower: resData }, () => {
                        this.getNews();
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    getNews = () => {
        const data = this.state.dataTower[0];
        fetch(urlApi + "c_newsandpromo/getDatanews/IFCAMOBILE/O/Y", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Token: this.state.token
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.Error == false) {
                    const resData = res.Data;
                    this.setState({ dataNews: resData });
                } else {
                    console.log("response news", res);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    onRefresh = () => {
        this.setState({ refreshing: true });
        // this.loadData()
        this.getInvoice();
    };

    handleNavigation = (screenName, passedProps) => {
        this.setState({ isDisable: true }, () => {
            this.goToScreen(screenName, passedProps);
        });
    };

    goToScreen = (screenName, passedProps) => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
                passProps: {
                    passed: passedProps
                }
            }
        });
    };

    componentDidDisappear() {
        this.setState({ isDisable: false });
    }

    render() {
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: "clamp"
        });
        const profileImageHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
            extrapolate: "clamp"
        });

        const profileImageMarginTop = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [
                HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_HEIGHT / 2,
                HEADER_MAX_HEIGHT + 5
            ],
            extrapolate: "clamp"
        });
        const headerZindex = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 120],
            outputRange: [0, 0, 1000],
            extrapolate: "clamp"
        });

        const headerTitleBottom = this.state.scrollY.interpolate({
            inputRange: [
                0,
                HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                HEADER_MAX_HEIGHT -
                    HEADER_MIN_HEIGHT +
                    6 +
                    PROFILE_IMAGE_MIN_HEIGHT,
                HEADER_MAX_HEIGHT -
                    HEADER_MIN_HEIGHT +
                    6 +
                    PROFILE_IMAGE_MIN_HEIGHT +
                    16
            ],
            outputRange: [-20, -20, -20, 0],
            extrapolate: "clamp"
        });

        const data = this.state.dataProfile;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {/* <StatusBar backgroundColor = "#00AFF0" /> */}
                <View style={{ flex: 1 }}>
                    <Header
                        noLeft
                        androidStatusBarColor="#008BBF"
                        style={{ backgroundColor: "#fff" }}
                    >
                        <Left style={{ flex: 1 }} />
                        <Body
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "row"
                            }}
                        >
                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require("../../../assets/images/alfa-logo.png")}
                            />
                            <Title style={Style.textBlack}>Alfaland</Title>
                        </Body>
                        <Right style={{ flex: 1 }} />
                    </Header>

                    <ScrollView
                        style={{ flex: 1 }}
                        scrollEventThrottle={16}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: { y: this.state.scrollY }
                                }
                            }
                        ])}
                    >
                        <OfflineNotice />

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "white",
                                paddingTop: 20
                            }}
                        >
                            <Text
                                style={[
                                    { paddingHorizontal: 16 },
                                    Style.textBlack
                                ]}
                            >
                                Hello, {data.name}
                            </Text>
                            <Text
                                style={[
                                    Style.textBlack,
                                    Style.textMedium,
                                    { paddingHorizontal: 16, fontSize : 18},
                                ]}
                            >
                                What We Can Help You ?
                            </Text>
                            <View
                                style={{
                                    marginVertical: 16,
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    marginHorizontal: 10
                                }}
                            >
                                <CategoryMenu
                                    imgUrl={require("@Asset/images/icon-home/bill_blue.png")}
                                    name="Finance"
                                    tapTo="screen.Billing"
                                    passing={this.state.totalInvoiceDue}
                                    {...this.props}
                                />
                                <CategoryMenu
                                    imgUrl={require("@Asset/images/icon-home/helpdesk_blue.png")}
                                    name="Helpdesk"
                                    tapTo="screen.HelpDesk"
                                    {...this.props}
                                />
                                <CategoryMenu
                                    imgUrl={require("@Asset/images/icon-home/meter_blue.png")}
                                    name="Meter"
                                    tapTo="screen.Metrix"
                                    {...this.props}
                                />
                                <CategoryMenu
                                    imgUrl={require("@Asset/images/icon-home/overtime_blue.png")}
                                    name="Overtime"
                                    tapTo="screen.Overtime"
                                    {...this.props}
                                />
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <Card
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: 10,
                                        shadowOffset: { width: 1, height: 1 },
                                        shadowColor: "#37BEB7",
                                        shadowOpacity: 0.5,
                                        elevation: 5,
                                        paddingHorizontal: 10,
                                        paddingVertical: 10
                                    }}
                                >
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: "500",
                                                    textAlign: "left"
                                                }}
                                            >
                                                Invoice Due
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "500",
                                                    textAlign: "right"
                                                }}
                                            >
                                                Total Invoice
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "500",
                                                    textAlign: "left",
                                                    fontWeight: "300"
                                                }}
                                            >
                                                Date {this.state.dateNow}
                                            </Text>
                                            <View style={{ right: 20 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 30,
                                                        fontWeight: "500",
                                                        textAlign: "right"
                                                    }}
                                                >
                                                    {this.state.totalInvoice}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: "500",
                                                    textAlign: "left",
                                                    color: "#F99B23"
                                                }}
                                            >
                                                Rp.{" "}
                                                {numFormat(
                                                    this.state.totalInvoiceDue
                                                )}
                                            </Text>
                                            <View
                                                style={{ right: 8 }}
                                                pointerEvents={
                                                    this.state.isDisable
                                                        ? "none"
                                                        : "auto"
                                                }
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.handleNavigation(
                                                            "screen.Billing",
                                                            this.state
                                                                .totalInvoiceDue
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#41B649"
                                                        }}
                                                    >
                                                        View All
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {/* <TouchableOpacity style={{ position: 'absolute', right:20,}}>
                                        <Text>View All</Text>
                                    </TouchableOpacity> */}
                                        {/* <TouchableOpacity>
                                        <Text>19</Text>
                                    </TouchableOpacity> */}
                                    </View>
                                </Card>
                                <View
                                    style={{
                                        marginTop: 32,
                                        paddingHorizontal: 16
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500"
                                        }}
                                    >
                                        News and Information
                                    </Text>
                                    <View
                                        style={{ marginTop: 20 }}
                                        pointerEvents={
                                            this.state.isDisable
                                                ? "none"
                                                : "auto"
                                        }
                                    >
                                        {this.state.dataNews.map(
                                            (data, key) => (
                                                <TouchableOpacity
                                                    key={key}
                                                    onPress={() =>
                                                        this.handleNavigation(
                                                            "screen.NewsDetail",
                                                            data.id
                                                        )
                                                    }
                                                >
                                                    <News
                                                        key={key}
                                                        width={width}
                                                        data={data}
                                                    />
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

export default Home;

const nbStyles = {
    subtitle: {
        textAlign: "center",
        color: "#ACD2FA"
    },
    btn: {
        marginTop: 15
    },

    icon_home: {
        width: 50,
        // height: 200
        height: 80
    }
};
