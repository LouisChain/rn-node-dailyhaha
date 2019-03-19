import React from "react"
import {Dimensions, View, Text} from "react-native";
import {useNavigationParam} from "react-navigation-hooks"
import { WebView } from 'react-native-webview';


const {width, height} = Dimensions.get("window");

function GamePlayerScreen() {
  const gameUrl = useNavigationParam("gameUrl")
  return (
    <View style={{flex: 1}}>
      <WebView
        source={{uri: gameUrl.replace("swf", "htm")}}
        style={{marginTop: 20}}
      />
    </View>
  );
}

export default GamePlayerScreen;