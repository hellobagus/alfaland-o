import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class ZonkScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Kaming Sun</Text>
            </View>
        );
    }
}
export default ZonkScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});