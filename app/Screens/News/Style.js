import {Dimensions} from 'react-native'
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;


export default {
    wrapTitle : {
        marginHorizontal : 10,
        marginVertical : 10
    },
    wrapContent :{
        marginHorizontal : 10
    }
}