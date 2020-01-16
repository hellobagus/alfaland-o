import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

//////BELOM KEPAKE

class ImageViews extends Component {
    render() {
        return (
            <ImageView
                glideAlways
                images={images}
                imageIndex={imageIndex}
                animationType="fade"
                isVisible={isImageViewVisible}
                renderFooter={this.renderFooter}
                onClose={() => this.setState({isImageViewVisible: false})}
            />
        );
    }
}
export default ImageViews;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});