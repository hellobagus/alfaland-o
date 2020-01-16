import { Dimensions, PixelRatio } from "react-native";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
    wrap: {
        marginTop: 16,
        marginLeft: 10,
        marginRight: 10
    },
    rowWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 32,
        marginVertical: 16,
        flex: 1
    },
    icon: {
        color: "#42B649",
        fontSize: 24
    },
    subWrap: {
        marginTop: 0,
        marginHorizontal: 10
    },
    subWrapBordered: {
        marginVertical: 25,
        borderBottomWidth: 3,
        borderBottomColor: "#F2F2F2"
    },
    borderedLayout: {
        borderBottomWidth: 1,
        borderBottomColor: "#F2F2F2"
    },
    title: {
        fontSize: 25,
        fontFamily: "Montserrat-SemiBold",
        color: "#333"
    },
    subTitle: {
        fontSize: 16,
        fontFamily: "Montserrat-SemiBold",
        color: "#4E4E4E",
        lineHeight: 32
    },
    menuWrap: {
        paddingVertical: 20
    },
    btnLayout: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 10
    },
    btnBoxKosong: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        borderRadius: 5,
        width: "40%",
        borderColor: "transparent",
        borderWidth: 1
    },
    btnText: {
        color: "#333",
        fontFamily: "Montserrat-SemiBold",
        fontSize: 12,
        textAlign: "center"
    },
    tabStyle: {
        borderColor: "#42B649",
        backgroundColor: "#42B649",
        paddingVertical: 10
    },
    tabTextStyle: {
        color: "white",
        fontFamily: "Montserrat-SemiBold"
    },
    activeTabStyle: { backgroundColor: "#F6F9FC" },
    activeTabTextStyle: {
        color: "#909090",
        fontFamily: "Montserrat-SemiBold"
    },
    radioLayout: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 30,
        alignItems: "center"
    },
    radioLayoutBottomBordered: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 30,
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#F3F3F3"
    },
    btnBox2: {
        backgroundColor: "#5EC7C0",
        borderWidth: 1,
        borderColor: "#15B8AE",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "30%"
    },
    textButton: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
        textAlign: "center"
    },
    nullList: {
        height: deviceHeight - deviceHeight / 3,
        justifyContent: "center",
        alignItems: "center"
    },
    btnLoadingWrap: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    content__header: {
        padding: 15,
        paddingBottom: 0,

        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },

    content__heading: {
        marginBottom: 2,
        fontSize: 24,
        color: "#333",
        fontFamily: "Montserrat-SemiBold"
    },

    content__subheading: {
        fontSize: 16,
        color: "#555",
        fontFamily: "Montserrat-Regular"
    },

    content__inside: {
        padding: 15
    },
    flatlist: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        marginHorizontal : 1,
        marginVertical : 5,
        elevation: 3,
        borderRadius: 4,
        shadowOffset : { width:1, height: 1},
        shadowColor:"#37BEB7",
        shadowOpacity:0.5,
    },
    totalUsage: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop : 10
    }
};
