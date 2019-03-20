import React from "react"
import {useNavigationParam} from "react-navigation-hooks"
import {Dimensions, View} from "react-native";
import ImageAutoHeight from "../../components/ImageAutoHeight";

function GifPlayerScreen() {
  const url = useNavigationParam("url");

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black"}}>
      <ImageAutoHeight uri={url.replace(".jpg", ".gif")} width={Dimensions.get("window").width}/>
    </View>
  );
}

export default GifPlayerScreen;