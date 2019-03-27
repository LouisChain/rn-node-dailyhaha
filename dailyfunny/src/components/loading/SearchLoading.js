import React from "react";
import {ActivityIndicator, View} from "react-native";
import {COLORS} from "../../styles/styles";

function SearchLoading(props) {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <ActivityIndicator size="small" color={COLORS.activeColor}/>
    </View>
  );
}

const styles = {
  container: {flex: 1, justifyContent: "center", alignItems: "center"}
};

export default SearchLoading;