import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";

export default class FooterLoading extends Component {
  render() {
    return (
      <View style={[styles.conainer, this.props.containerStyle]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = {
  conainer: { flex: 1, justifyContent: "center", alignItems: "center" }
};
