import React, { Component } from 'react'
import { 
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native'




class News extends Component {

    constructor(props){
        super(props)

        this.state = {
            imagesStyle :{
                width : this.props.width - 50,
                height : 100,
                
            }
        }
    }

    componentWillMount(){
        // const width = this.props.width

        // if(width <= 320){
        //     this.setState({width : 120})
        // } else if(width <= 375){
        //     this.setState({width : 150})
        // } else if(width <= 414){
        //     this.setState({width : 170})            
        // } 
        
        // console.log('width', this.state.imagesStyle)
        // const widths = Math.round((this.props.width + 10) - (this.props.width / 1.6))
        
        // this.setState({imagesStyle: {width : widths ,height: 100}}) 

        

        // console.log('height', this.state.imagesStyle.height)
        
    }
    
    render() {
        const data = this.props.data;
        return (
            <View>
                <View style={{ 
                    marginTop: 16, 
                    paddingBottom:8,
                    paddingVertical : 10
                }}>
                    <View>
                        <View style={{flex:1}}>
                            <Image 
                            style={this.state.imagesStyle}
                            source={{uri: data.picture}}/>
                        </View>
                        <View style={{flex:1,
                        alignItems:'flex-start',
                        justifyContent:'space-evenly',
                        paddingTop: 8}}>
                            <Text style={{fontSize:12,
                            fontWeight: 'bold'}}>
                                {data.subject}
                            </Text>
                            <Text style={{fontSize:8}}>
                                {data.descs}
                            </Text>
                        </View>
                    
                    </View>
                </View>
            </View>

        );
    }
}

export default News;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

});

