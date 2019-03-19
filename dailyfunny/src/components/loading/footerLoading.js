import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import {COLORS} from "../../styles/styles";

export default class FooterLoading extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <ActivityIndicator size="large" color={COLORS.activeColor} />
      </View>
    );
  }
}

const styles = {
  container: { flex: 1, justifyContent: "center", alignItems: "center" }
};
