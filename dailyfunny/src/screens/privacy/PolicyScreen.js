import React from "react";
import {View, Dimensions} from "react-native";
import {WebView} from "react-native-webview"

const {width, height} = Dimensions.get("window");

export default function PolicyScreen(props) {
  return (
    <View style={{flex: 1, paddingHorizontal: 12, justifyContent: "center", alignItems: "center"}}>
      <WebView
        style={{width, height}}
        // source={{uri: 'file:///android_asset/html/index.html'}}
        source={{uri: "https://trinhluu33.wixsite.com/website"}}
      />
    </View>
  )
}