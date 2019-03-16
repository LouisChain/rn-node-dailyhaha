import React from "react"
import {Text, TouchableOpacity, View} from "react-native";
import {FONT_SIZE, LAYOUT_SPACING} from "../styles/styles";

const colors = ["green", "blue", "red", "purple", "orange"];
let randomColor = colors[Math.floor(Math.random() * colors.length)];

function Tags(props) {
  const {tags} = props;
  return (
    <View style={styles.container}>
      {
        tags.map((item, index) =>
          (<TouchableOpacity style={styles.button.container} key={index} onPress={() => props.onTagPress(item)}>
              <Text style={styles.button.text}>
                #{item}
              </Text>
            </TouchableOpacity>
          )
        )
      }
    </View>
  )
}

const styles = {
  container: {
    padding: LAYOUT_SPACING.large,
    flexDirection: "row",
    justifyContent: "flex-start"

  },
  button: {
    container: {
      backgroundColor: "white", borderWidth: 1,
      borderRadius: 16,
      borderColor: randomColor,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: LAYOUT_SPACING.small,
      marginRight: LAYOUT_SPACING.large,
      height: 34,
    },
    text: {
      fontSize: FONT_SIZE.large,
      color: randomColor
    }
  }
}

export default Tags;