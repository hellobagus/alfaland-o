import { Dimensions, PixelRatio } from "react-native";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
    wrap : {
        paddingHorizontal: 20,
        // marginTop : 50,
        marginLeft : 10,
        marginRight : 10
    },
    subWrap : {
        marginVertical : 25
    },
    subWrap2 : {
        marginVertical : 10
    },
    subWrapBordered : {
        marginVertical : 25,
        borderBottomWidth : 3,
        borderBottomColor : '#F2F2F2'
    },
    borderedLayout :{
        borderBottomWidth : 1,
        borderBottomColor : '#F2F2F2'
    },
    title :{
        fontSize : 25,
        fontFamily: 'Montserrat-SemiBold',
        color : "#333"
    },
    subTitle :{
        fontSize : 12,
        fontFamily: 'Montserrat-SemiBold',
        color : "#4E4E4E"
    },
    menuWrap :{ 
        paddingVertical: 20,
    },
    btnLayout :{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 10,
    },
    btnBoxKosong: {
        paddingHorizontal :20,
        paddingVertical :20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 5,
        width: '40%',
        borderColor: 'transparent',
        borderWidth: 1
    },
    btnText: {
        color: '#333',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        textAlign: 'center'
    },
    tabStyle :{
        borderColor:'#15B8AE',
        backgroundColor:'#15B8AE',
        paddingVertical:10
    },
    tabTextStyle :{
        color:'white',
        fontFamily: 'Montserrat-SemiBold',
    },
    activeTabStyle : {backgroundColor:'#F6F9FC'},
    activeTabTextStyle : {
        color:'#909090',
        fontFamily: 'Montserrat-SemiBold',        
    },
    radioLayout :{
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        paddingVertical : 30,
        alignItems : 'center',
    },
    radioLayoutBottomBordered :{
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        paddingVertical : 30,
        alignItems : 'center',
        borderBottomWidth :2 ,
        borderBottomColor : '#F3F3F3'
    },
    btnBox2 :{ 
        backgroundColor  : '#5EC7C0',
        borderWidth : 1,
        borderColor : '#15B8AE',
        borderRadius : 5,
        paddingHorizontal : 10,
        paddingVertical : 10,
        width : '30%'
    },
    textButton :{
        color : '#fff',
        fontSize : 15,
        fontFamily: 'Montserrat-SemiBold',        
        textAlign : 'center'
    },
    tabContent: {
        color: '#333',
        fontSize: 18,
        textAlign : 'center'
    },
    picker : {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#CCC',
        paddingLeft: 15,
    },
    textArea:{
        borderRadius : 5,
        backgroundColor : '#F6F6F6'
    },
    nullList: {
        height: deviceHeight - deviceHeight / 3,
        justifyContent: "center",
        alignItems: "center"
    },
}