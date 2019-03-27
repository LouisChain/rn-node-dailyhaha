import React from "react"
import {View} from "react-native";
import {FONT_SIZE, LAYOUT_SPACING} from "../../styles/styles";
import {getColor} from "../../utils/colorTag"
import Button from "./Button";

function Tags(props) {
  const {tags} = props;
  return (
    <View
      onLayout={(event) => {
        let {x, y, width, height} = event.nativeEvent.layout;
      }}
      style={[styles.container, props.containerStyle]}>
      {
        tags.map((item, index) => {
            let tagColor = getColor(item);
            let normalColor = "transparent"
            let normal = {
              text: {
                fontSize: FONT_SIZE.large,
                color: tagColor
              },
              button: {
                backgroundColor: normalColor,
                borderWidth: 1,
                borderRadius: 16,
                borderColor: tagColor,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: LAYOUT_SPACING.small,
                marginRight: LAYOUT_SPACING.large,
                height: 30,
                marginBottom: LAYOUT_SPACING.xsmall
              }
            };
            let pressed = {
              text: {
                fontSize: FONT_SIZE.large,
                color: "white"
              },
              button: {
                backgroundColor: tagColor,
                borderWidth: 1,
                borderRadius: 16,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: LAYOUT_SPACING.small,
                marginRight: LAYOUT_SPACING.large,
                height: 30,
                marginBottom: LAYOUT_SPACING.xsmall
              }
            }
            return <Button key={index}
                           pressed={pressed}
                           normal={normal}
                           text={`#${item}`}
                           onPress={() => props.onTagPress(item)}/>
          }
        )
      }
    </View>
  )
}

const styles = {
  container: {
    padding: LAYOUT_SPACING.normal,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap"
  }
}

export default Tags;