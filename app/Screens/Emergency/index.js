// Note : ini semua masih hardcode
import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Button,
    FlatList
} from "react-native";
import { Container, Content, Text, H2, Icon, Subtitle } from "native-base";
import nbStyles from "./Style";
import { Navigation } from "react-native-navigation";
import Title from "@Component/Title";
import SubTitle from "@Component/SubTitle";
import EmerCard from "@Component/EmerCard";
import Communications from "react-native-communications";
import OfflineNotice from "@Component/OfflineNotice";
import { contactService } from "../../_services";

class Emergency extends Component {
    static options(passProps) {
        return {
            topBar: {
                noBorder: true,
                height: 0
            },
            statusBar: {
                style: "dark",
                backgroundColor: "#fff"
            }
        };
    }

    constructor(props) {
        super(props);

        Navigation.events().bindComponent(this);

        this.state = {
            dataEmergency: []
        };
    }

    componentDidMount() {
        this.getEmergency();
    }

    getEmergency = () => {
        contactService.getEmergency({ cons: "IFCAMOBILE" }).then(res => {
            if (!res.Error) {
                this.setState({ dataEmergency: res.Data });
            }
        });
    };

    renderItem = ({item}) => {
        return (
            <EmerCard
                imgUrl={item.icon_url}
                contact_name={item.contact_name}
                contact_no={item.contact_no}
                {...this.props}
            />
        );
    };

    render() {
        return (
            <Container>
                <OfflineNotice />
                <Content>
                    <View style={nbStyles.wrap}>
                        <Title
                            style={nbStyles.title}
                            text="Emergency Contact"
                        />
                        {/* Start Menu Kotak Kotak */}
                        {/* <View style={nbStyles.menuWrap}>
                            <FlatList
                                contentContainerStyle={nbStyles.btnLayout}
                                data={this.state.dataEmergency}
                                renderItem={this.renderItem}
                                numColumns={3}
                            />
                        </View> */}
                        {/* END MENU KOTAK KOTAK */}
                    </View>
                    <FlatList
                        contentContainerStyle={nbStyles.btnLayout}
                        keyExtractor={(item)=> item.line_no}
                        data={this.state.dataEmergency}
                        renderItem={this.renderItem}
                        numColumns={3}
                    />
                </Content>
            </Container>
        );
    }
}
export default Emergency;
