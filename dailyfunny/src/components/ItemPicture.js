import {Alert, Image, Text, View} from "react-native";
import Tags from "../screens/pic/funnyPicsScreen";
import React from "react";
import {LAYOUT_SPACING} from "../styles/styles";

const onTagPress = (item) => {
  Alert.alert(item)
}

const Item = React.memo(props => {
    const {data, type} = props;
    return (
      <View style={styles.item.container}>
        <Text style={styles.item.text}>{data.caption}</Text>
        <Image
          source={{uri: data.url}}
          style={styles.item.image}
        />
        <Tags tags={data.tags} onTagPress={(item) => onTagPress(item)}/>
      </View>
    )
  }
)

const styles = {
  container: {
    flex: 1
  },
  item: {
    container: {
      paddingTop: LAYOUT_SPACING.large,
      alignSelf: "flex-start",
      height: "100%"
    },
    text: {
      color: "black",
      fontSize: 32,
      fontWeight: "bold",
      flexDirection: "row",
      flexWrap: "wrap",
      paddingLeft: LAYOUT_SPACING.large
    },
    image: {
      width,
      height: width,
      resizeMode: "contain"
    }
  }
}

export default Item;
