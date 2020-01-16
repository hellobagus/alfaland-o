import React from "react";
import { TouchableWithoutFeedback, View, Text } from "react-native";
import { ParallaxImage } from "react-native-snap-carousel";
import styles from "./styles";
import Style from "../../Theme/Style";

export default function ItemCarousel(props) {
    const { item, parallaxProps, onPress } = props;

    return (
        <TouchableWithoutFeedback onPress={() => onPress()}>
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.picture }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                {item.subject && (
                    <View style={styles.newsTitle}>
                        <Text
                            style={[Style.textWhite, Style.textMedium]}
                            numberOfLines={2}
                        >
                            {item.subject}
                        </Text>
                        {/* <Text style={styles.newsTitleText_small}>{item.descs}</Text> */}
                    </View>
                )}

                {/* <View style={styles.newsTitle_small}>
              <Text style={styles.newsTitleText_small} numberOfLines={2}>
                  { item.descs }
              </Text>
            </View> */}
            </View>
        </TouchableWithoutFeedback>
    );
}
