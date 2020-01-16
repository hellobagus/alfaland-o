import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from "react-native";
import { Navigation } from "react-native-navigation";
import {Modalize} from "react-native-modalize";

export class FixedContent extends React.PureComponent {
    modal = React.createRef();

    componentDidMount() {
        this.openModal();
    }

    onClosed = () => {
        Navigation.dismissModal(this.props.componentId);
    };

    openModal = () => {
        if (this.modal.current) {
            this.modal.current.open();
        }
    };

    closeModal = () => {
        if (this.modal.current) {
            this.modal.current.close();
        }
    };

    render() {
        return (
            <Modalize
                ref={this.modal}
                onClosed={this.onClosed}
                adjustToContentHeight
            >
                <View style={s.content}>{this.props.child}</View>
            </Modalize>
        );
    }
}

const s = StyleSheet.create({
    content: {
        padding: 20
    },

    content__icon: {
        width: 32,
        height: 32,

        marginBottom: 20
    },

    content__subheading: {
        marginBottom: 2,

        fontSize: 16,
        fontWeight: "600",
        color: "#ccc"
    },

    content__heading: {
        fontSize: 24,
        fontWeight: "600",
        color: "#333"
    },

    content__description: {
        paddingTop: 10,
        paddingBottom: 10,

        fontSize: 15,
        fontWeight: "200",
        lineHeight: 22,
        color: "#666"
    },

    content__input: {
        paddingVertical: 15,
        marginBottom: 20,

        width: "100%",

        borderWidth: 1,
        borderColor: "transparent",
        borderBottomColor: "#cdcdcd",
        borderRadius: 6
    },

    content__button: {
        paddingVertical: 15,

        width: "100%",

        backgroundColor: "#333",
        borderRadius: 6
    },

    content__buttonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center"
    }
});
