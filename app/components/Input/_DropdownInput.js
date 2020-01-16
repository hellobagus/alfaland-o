import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import ModalSelector from "react-native-modal-selector";
import Style from "../../Theme/Style";

const DropdownInput = props => {
    return (
        <View>
            {props.label && (
                <Text style={Style.textBlack}>{props.label}</Text>
            )}
            <ModalSelector
                data={props.data}
                optionTextStyle={{ color: "#333" }}
                animationType="fade"
                selectedItemTextStyle={{ color: "#3C85F1" }}
                accessible={true}
                keyExtractor={item => item.id}
                labelExtractor={item => item.name}
                cancelButtonAccessibilityLabel={"Cancel Button"}
                overlayStyle={styles.overlay}
                optionContainerStyle={styles.optionContainer}
                cancelContainerStyle={styles.cancelContainer}
                onChange={option => {
                    props.onChange(option);
                }}
            >
                <TextInput
                    style={[Style.textBlack, styles.input]}
                    onFocus={() => this.selector.open()}
                    placeholder={`Select ${props.label}`}
                    editable={false}
                    placeholderTextColor="#a9a9a9"
                    value={props.value}
                />
            </ModalSelector>
        </View>
    );
};

export default DropdownInput;

const styles = StyleSheet.create({
    input: {
        height: 40,
        backgroundColor: "#f5f5f5",
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    overlay : {
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent:  'flex-end',
    },
    optionContainer : {
        backgroundColor : '#fff',
        elevation : 8,
        borderRadius : 10
    },
    cancelContainer : {
        backgroundColor : '#f3f3f3',
        elevation : 8,
        borderRadius : 10
    }
});
