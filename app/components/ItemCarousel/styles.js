import { StyleSheet, Dimensions, Platform } from "react-native";
const dh = Dimensions.get("window").height;
const dw = Dimensions.get("window").width;

export default StyleSheet.create({
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: "white",
        borderRadius: 8
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover"
    },
    item: {
        marginTop : 10,
        width: dw - 25,
        height: dw / 2,
        borderRadius : 15,
        elevation : 4,
        shadowOffset: { width: 0.5, height: 1 },
        shadowColor: "#37BEB7",
        shadowOpacity: 0.5,
    },
    newsTitleText: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginHorizontal: 16
        // marginVertical : 2
    },
    newsTitleText_small: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: 16,
        // fontWeight: 'bold',
        marginHorizontal: 16,
        marginVertical: 4
    },
    newsTitle: {
        position: "absolute",
        borderBottomEndRadius : 5,
        borderBottomStartRadius : 5,
        padding : 10,
        left: 0,
        bottom: 0,
        width: dw - 25,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        
    },

    newsTitle_small: {
        position: "absolute",
        borderRadius: 5,
        left: 0,
        bottom: 0,
        width: dw - 60,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    }
});
