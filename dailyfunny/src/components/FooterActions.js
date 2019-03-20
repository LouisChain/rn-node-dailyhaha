import React from "react"
import {Text, TouchableOpacity, View} from "react-native";
import {FONT_SIZE, LAYOUT_SPACING} from "../styles/styles";
import Icon from "../components/Icon"

function FooterActions(props) {
  const {views, comments, shared} = props;
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={styles.item.container}>
        <Icon name={"eye"} set={"FontAwesome"} color={"gray"}/>
        <Text style={styles.item.text}>{views}</Text>
      </View>
      <TouchableOpacity style={styles.item.container} onPress={props.onComment}>
        <Icon name={"commenting-o"} set={"FontAwesome"} color={"gray"}/>
        <Text style={styles.item.text}>{comments}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item.container} onPress={props.onShare}>
        <Icon name={"share-square-o"} set={"FontAwesome"} color={"gray"}/>
        <Text style={styles.item.text}>{shared}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container: {
    padding: LAYOUT_SPACING.small,
    flexDirection: "row",
  },
  item: {
    container: {
      paddingHorizontal: LAYOUT_SPACING.normal,
      flexDirection: "row",
      alignItems: "center"
    },
    text: {
      color: "gray",
      fontSize: FONT_SIZE.large
    }
  }
}

export default FooterActions