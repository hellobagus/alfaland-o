import React, { Component } from "react";
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Style from '@Theme/Style'
import nbStyle from './Style'
import ImageView from 'react-native-image-view';
import { Container, Content } from "native-base";
import OfflineNotice from '@Component/OfflineNotice';
import HTML from 'react-native-render-html';
const { height, width } = Dimensions.get('window');
import { newsService } from '../../_services';
import { sessions } from '../../_helpers';

class NewsDetail extends Component {
    static options(passProps){
        return {
            topBar : {
                noBorder: true,
                
            },
            bottomTabs :{
                visible : false,
                drawBehind: true, 
                animate: true
            }
        }
    }
    constructor(props){
        super(props)

        this.state = {
            token : '',
            id : props.passed,

            activeTab: 0,
            imageIndex: 0,
            isImageViewVisible: false,

            dataNews : [],
            isLoaded : false
        }

    }

    async componentWillMount(){
        this.getNewsDetail()
    }

    getNewsDetail =() =>{
        const data = {
            id : this.state.id,
            cons : "IFCAMOBILE"
        };
        newsService.getDatanewsById(data).then(res =>{
            if(res.Error == false){
                const resData = res.Data[0]
                this.setState({dataNews: resData })
            }
            this.setState({isLoaded : true})
        });
    }

    render() {
        const data = this.state.dataNews

        const images = [
            {
                source: {
                    uri: data.picture,
                },
                title: data.subject,
                width: null,
                height: null,
            },
        ];

        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <SafeAreaView style={styles.container}>
                        <TouchableOpacity onPress={()=>this.setState({isImageViewVisible:true})}>
                            <Image style={styles.imagesStyle}
                            source = {{uri : data.picture}}
                            />
                        </TouchableOpacity>
                        <View style={nbStyle.wrapTitle}>
                            <Text style={[Style.textMedium,{fontWeight:'bold'}]}>{data.subject}</Text>
                        </View>
                        <View style={nbStyle.wrapContent}>
                            {/* <Text style={Style.textSmall}>{data.content}</Text> */}
                            {this.state.isLoaded && data.content ?
                                <HTML html={data.content} imagesMaxWidth={width} />    
                            : null}
                        </View>
                        
                        
                        <Text>{data.youtube_link}</Text>

                        <ImageView
                        images={images}
                        imageIndex={0}
                        animationType="fade"
                        isVisible={this.state.isImageViewVisible}
                        // renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
                        onClose={() => this.setState({isImageViewVisible: false})}
                    />
                    </SafeAreaView>
                </Content>
            </Container>
        );
    }
}
export default NewsDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // marginVertical : 10
        // justifyContent: 'center'
    },
    imagesStyle :{
        width : width,
        height : height * 0.3,
    }
});