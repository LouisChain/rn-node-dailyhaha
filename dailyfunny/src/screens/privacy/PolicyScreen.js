import React, {useState, useEffect} from "react";
import {View, Text, AsyncStorage, ScrollView, Button, Dimensions} from "react-native";
import {WebView} from "react-native-webview"
import {useNavigation} from "react-navigation-hooks"
import {MAIN} from "../../constants/routeConstants";
import {COLORS} from "../../styles/styles";

const KEY = "POLICY_KEY";
const {width, height} = Dimensions.get("window");

export default function PolicyScreen(props) {
  const {navigate} = useNavigation();

  useEffect(() => {
    checkPolicy();
  }, []);

  const checkPolicy = async () => {
    let result = await AsyncStorage.getItem(KEY);
    if (result === "ok") {
      //navigate to main screen
      navigate(MAIN);
    }
  }

  const onAgree = () => {
    AsyncStorage.setItem(KEY, "ok");
    // navigate to main screen
    navigate(MAIN);
  }

  return (
    <View style={{flex: 1, paddingHorizontal: 12, justifyContent: "center", alignItems: "center"}}>
      <WebView
        style={{width, height}}
        source={{uri: 'file:///android_asset/html/index.html'}}
        />
      <Button style={{position: "absolute", bottom: 12}} title={"I AGREE"} onPress={onAgree} color={COLORS.activeColor}/>
    </View>
  )
}