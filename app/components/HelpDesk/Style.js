import {Dimensions,PixelRatio} from 'react-native'
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;


export default {
    wrap : {
        paddingHorizontal: 20,
        marginTop : 50,
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

    modalView :{
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer : {
        backgroundColor : '#fff',
        height: deviceHeight/2,
        width : deviceWidth,
        // justifyContent : 'center',
        alignItems: 'center',
        borderTopLeftRadius : 18,
        borderTopRightRadius : 18,        
    },
    modalHeader :{
        flexDirection : 'row',
        justifyContent : 'space-between',
        width : deviceWidth,
        paddingHorizontal : 25,
        paddingTop : 22

    },
    modalBody :{
        justifyContent : 'center',
        height: deviceHeight - (deviceHeight/1.5),
        width : deviceWidth,
        paddingHorizontal : 25,
        paddingTop : 22

    },
    iconModal :{
        fontSize : 25,
        color : '#333',
        
    },
    textModal :{
        fontSize : 18,
        color : '#333'
    },
    subTitleModal :{
        // paddingVertical : 30,
        marginHorizontal : 60,
        paddingBottom : 50,
        fontSize : 16,
        color : '#333'
    },
    btnWrapModal :{
        marginHorizontal : 60,
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    btnYes :{
        width : 100,
        borderWidth : 1,
        borderColor : '#F9A233',
        borderRadius : 5,
        paddingVertical : 7,
        paddingHorizontal : 10,
    },
    btnNo :{
        width : 100,
        borderRadius : 5,
        backgroundColor : '#F99B23',
        paddingVertical : 7,
        paddingHorizontal : 10 
    },
    textNo :{
        color : '#fff',
        textAlign : 'center'
    },
    textYes : {
        color: '#F9A233',
        textAlign : 'center'
    },
    bottomModal :{
        justifyContent: "flex-end",
        margin: 0
    },
    starWrap :{
        paddingBottom : 40,
        paddingHorizontal : 10
    },
    modalBodyTitle :{
        paddingVertical : 15,
        textAlign : 'center'
    },
    pickerWrap :{
        width : '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical : 10,
        borderRadius : 5,
        borderWidth : 1,
        borderColor : '#E2DFE4',
        backgroundColor : '#F6F6F6'
    },
    avatarContainer: {
        width: deviceWidth - 100,
        marginVertical : 10,
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius : 5,      
        height: 200,
    },
    avatar: {
        width: deviceWidth - 100,
        height: 200,
        borderRadius : 5,      
    },
    sel : {
        width: deviceWidth - 100,
        marginVertical : 10,
        paddingVertical : 10,
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius : 5,      
        height: null,
    },
    iconRemove: {
        backgroundColor: '#EE6B60',
        // color : '#ff1744',
        position: 'absolute',
        borderRadius: 50,
        padding: 5,
        right: 0,
        top : 0
    },
}