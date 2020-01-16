import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Dimensions
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get("window");
import moment from "moment";
import Style from "../../Theme/Style";
import { Navigation } from "react-native-navigation";
import DatePicker from 'react-native-date-picker';

const DateInput = props => {
    const [time, setTime] = useState(props.value);
    const [visible, setVisible] = useState(false);

    const handlePicker = val => {
        setTime(val);
        setVisible(false);
        console.log('val',val);
        props.onChange((name = props.name), val);
    };

    const renderChild = () => {
        return (
            <DatePicker
                date={time}
                locale="id"
                onDateChange={handlePicker}
                {...props}
            />
        );
    };

    const setVisibleModal = () => {
        // const modal = modalTgl.current;
        // Navigation.showOverlay();
        // if(modal){
        //     modal.open();
        // }
        Navigation.showModal({
            stack: {
                children: [
                    {
                        component: {
                            name: "modal.FixedContent",
                            passProps: {
                                child: renderChild()
                            },
                            options: {
                                screenBackgroundColor: "transparent",
                                modalPresentationStyle: "overCurrentContext",
                                topBar: {
                                    visible: false,
                                    animate: true
                                }
                            }
                        }
                    }
                ]
            }
        });
    };

    useEffect(() => {
        setTime(props.value);
    }, [props.value]);

    return (
        <View>
            <Text style={Style.textBlack}>{props.label}</Text>
            <TouchableOpacity pointerEvents="auto" onPress={setVisibleModal}>
                <View pointerEvents="none">
                    <TextInput
                        style={[Style.textBlack, styles.input]}
                        placeholder={props.label}
                        editable={false}
                        placeholderTextColor="#a9a9a9"
                        value={
                            time == ""
                                ? ""
                                : moment(time).format(
                                      props.format
                                          ? props.format
                                          : "dddd, DD MMMM YYYY HH:mm"
                                  )
                        }
                    />
                </View>
            </TouchableOpacity>
            <DateTimePicker
                mode={"datetime"}
                is24Hour={true}
                date={time}
                isVisible={visible}
                minimumDate={props.min ? props.min : new Date()}
                onConfirm={handlePicker}
                onCancel={() => setVisible(!visible)}
                {...props}
            />
        </View>
    );
};

export default DateInput;

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

    inputTime: {
        height: 40,
        backgroundColor: "#f5f5f5",
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: deviceWidth * 0.4,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    inputUsage: {
        height: 40,
        color: "black",
        marginBottom: 16,
        // borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    inputDate: {
        height: 40,
        backgroundColor: "#f5f5f5",
        color: "black",
        paddingHorizontal: 10,
        marginBottom: 16,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left"
    },
    btnMin: {
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: "#f1f1f1",
        width: deviceWidth * 0.08
    },
    btnPlus: {
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: "#f1f1f1",
        width: deviceWidth * 0.08
    }
});
