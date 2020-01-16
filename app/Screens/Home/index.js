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
    Body,
    Card,
    Icon,
    Title,
    Right
} from "native-base";
import CategoryMenu from "@Component/Home/Category/CategoryMenu";
import { Navigation } from "react-native-navigation";
import { USER_KEY } from "../config";
const { height, width } = Dimensions.get("window");
import OfflineNotice from "@Component/OfflineNotice";
import Style from "../../Theme/Style";
import { sessions } from "../../_helpers";
import { profilService, dashboardService, newsService } from "../../_services";
import { urlApi } from "@Config";
import Carousel, {
    Pagination,
    ParallaxImage
} from "react-native-snap-carousel";
import InvoiceCard from "../../components/Home/InvoiceCard";
import ItemCarousel from "../../components/ItemCarousel/item";
import LinearGradient from "react-native-linear-gradient";
const colorsLinear = ["rgba(55, 190, 183, 1)", "rgba(0, 175, 240, 1)"];
const colorsCarousel = ["#FDFEFF", "#CBE6FA", "#51B3EB"];
class Home extends React.Component {
    static options(passProps) {
        const isIos = Platform.OS === "ios";

        return {
            topBar: {
                visible: false,
                // height : 0,
                drawBehind: true,
                background: {
                    color: "#fff"
                }
            },
            statusBar: {
                style: isIos ? "dark" : "light",
                backgroundColor: "#008bbf"
            }
        };
    }

    handleOverlay = (name) => {
        Navigation.showOverlay({
            component: {
            name,
            options: { overlay: { interceptTouchOutside: true } },
            },
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            isDisable: false,
            name: "",
            totalInvoice: 0,
            totalInvoiceDue: ".00",
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
            email: await sessions.getSess("@User"),
            name: await sessions.getSess("@Name"),
            token: await sessions.getSess("@Token"),
            userId: await sessions.getSess("@UserId"),
            dataTower: await sessions.getSess("@UserProject"),

            mounted: true
        };

        console.log("data", data);

        this.setState(data, () => {
            this.getInvoice();
            this.getNews();
        });
    }

    // getProfile = () => {
    //     const data = {
    //         email: this.state.email,
    //         userId: this.state.userId
    //     };

    //     profilService.getData(data).then(res => {
    //         console.log("res prof", res);
    //         const resData = res.Data[0];
    //         // ? Agar Gambar Tidak ter cache
    //         this.setState({
    //             dataProfile: resData
    //         });

    //     });
    // };

    getInvoice = async () => {
        const { db_profile } = this.state.dataTower[0];
        const data = {
            cons: db_profile,
            email: this.state.email
        };

        dashboardService.getInvoice(data).then(res => {
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
                    sessions.setSess("@TotalInvoiceDue", invDue);
                }
            );
            this.setState({ refreshing: false });
            console.log("getInvoice", res);

        });
    };

    getNews = () => {
        const dt = this.state.dataTower[0];
        const data = {
            cons: dt.db_profile,
            product_cd: "O",
            isHome: "Y"
        };

        newsService.getDatanews(data).then(res => {
            if (res.Error == false) {
                const resData = res.Data;
                this.setState({ dataNews: resData });
            } 
            console.log("response news", res);
        });
    };

    renderNews = ({ item, index }, parallaxProps) => {
        return (
            <ItemCarousel
                item={item}
                parallaxProps={parallaxProps}
                onPress={() =>
                    this.handleNavigation("screen.NewsDetail", item.id)
                }
            />
        );
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
        const { name } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <OfflineNotice />
                    <Header
                        noLeft
                        androidStatusBarColor="#008BBF"
                        style={{
                            backgroundColor: "#fff",
                            borderBottomWidth: 0
                        }}
                    >
                        <Left style={nbStyles.leftHeader}>
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../assets/images/alfa-logo.png")}
                            />
                            <Text style={nbStyles.textHeader}> Alfaland</Text>
                        </Left>

                        <Right style={{ flex: 1 }}>
                            <Text
                                style={[
                                    nbStyles.textHeader,
                                    Style.textBlue,
                                    Style.textMedium
                                ]}
                            >
                                Hi, {name.substr(0, name.indexOf(" "))}
                            </Text>
                        </Right>
                    </Header>
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={nbStyles.container}>
                            <View style={{height : height * 0.5}}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={colorsLinear}
                                    style={nbStyles.contentHeader}
                                >
                                    <Text style={nbStyles.textWelcome}>
                                        What can we serve you ?
                                    </Text>
                                    <View style={nbStyles.mewnuWrap}>
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
                                </LinearGradient>
                                <InvoiceCard
                                    dateNow={this.state.dateNow}
                                    totalInvoice={this.state.totalInvoice}
                                    totalInvoiceDue={this.state.totalInvoiceDue}
                                    onPress={() =>
                                        this.handleNavigation(
                                            "screen.Billing",
                                            this.state.totalInvoiceDue
                                        )
                                    }
                                />
                            </View>
                            <View
                                style={{
                                    height: height * 0.5,
                                    justifyContent: "flex-end"
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        paddingHorizontal: 16,
                                        fontWeight: "500"
                                    }}
                                >
                                    News and Information
                                </Text>
                                <LinearGradient
                                    style={{
                                        height: height * 0.4
                                    }}
                                    colors={colorsCarousel}
                                    pointerEvents={
                                        this.state.isDisable ? "none" : "auto"
                                    }
                                >
                                    <Carousel
                                        autoplay={false}
                                        sliderWidth={width}
                                        sliderHeight={width}
                                        itemWidth={width - 25}
                                        data={this.state.dataNews}
                                        renderItem={this.renderNews}
                                        hasParallaxImages={true}
                                    />
                                </LinearGradient>
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
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between"
    },
    leftHeader: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    textHeader: [Style.textBlack, Style.textLarge, { marginTop: 5 }],
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
    },
    mewnuWrap: {
        marginVertical: 16,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginHorizontal: 10
    },
    textWelcome: [Style.textWhite, { fontSize: 18, paddingHorizontal: 16 }],
    contentHeader: {
        paddingVertical: 16,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#37BEB7",
        shadowOpacity: 0.5,
        elevation: 4,
        marginTop : 4,
        // borderWidth: 1,
        backgroundColor: "rgba(0, 175, 240, 0.5)"
    }
};
