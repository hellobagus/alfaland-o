import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { nav } from "./../../_helpers";
import { Card } from "native-base";
import numFormat from "@Component/numFormat";
import Style from "../../Theme/Style";
const { width, height } = Dimensions.get("window");

export default function InvoiceCard(props) {
    const { dateNow, totalInvoice, totalInvoiceDue, onPress } = props;

    return (
        <View style={{ paddingHorizontal: 10, flex : 1 }}>
            <Card
                style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: "#37BEB7",
                    shadowOpacity: 0.5,
                    elevation: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}
            >
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text
                            style={[
                                Style.textBlack,
                                {
                                    fontSize: 18,
                                    fontWeight: "500",
                                    textAlign: "left"
                                }
                            ]}
                        >
                            Invoice Due
                        </Text>
                        <Text
                            style={[
                                Style.textBlack,
                                {
                                    fontSize: 12,
                                    fontWeight: "500",
                                    textAlign: "right"
                                }
                            ]}
                        >
                            Total Invoice
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text
                            style={[
                                Style.textGreyLight,
                                {
                                    fontSize: 12,
                                    textAlign: "left",
                                    fontWeight: "300"
                                }
                            ]}
                        >
                            Date {dateNow}
                        </Text>
                        <View style={{ right: 20 }}>
                            <Text
                                style={[
                                    Style.textBlack,
                                    {
                                        fontSize: 30,
                                        fontWeight: "500",
                                        textAlign: "right"
                                    }
                                ]}
                            >
                                {totalInvoice}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text
                            style={[
                                Style.textBlack,
                                {
                                    fontSize: 18,
                                    fontWeight: "500",
                                    textAlign: "left",
                                    color: "#F99B23"
                                }
                            ]}
                        >
                            Rp. {numFormat(totalInvoiceDue)}
                        </Text>
                        <View style={{ right: 8 }}>
                            <TouchableOpacity onPress={() => onPress()}>
                                <Text
                                    style={Style.textGreen}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <TouchableOpacity style={{ position: 'absolute', right:20,}}>
                <Text>View All</Text>
            </TouchableOpacity> */}
                    {/* <TouchableOpacity>
                <Text>19</Text>
            </TouchableOpacity> */}
                </View>
            </Card>
        </View>
    );
}
