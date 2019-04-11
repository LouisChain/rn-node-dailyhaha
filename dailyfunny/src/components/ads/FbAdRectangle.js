import React from "react"
import {Dimensions, View} from "react-native";
import {BannerView} from 'react-native-fbads';
import {AdSettings} from 'react-native-fbads';

const {width} = Dimensions.get("window");

AdSettings.addTestDevice(AdSettings.currentDeviceHash);

export default function ViewWithBanner(props) {
  return (
    <View style={[{height: 138 + width * 5 / 6, backgroundColor: "transparent"}, props.containerStyle]}>
      <BannerView
        placementId="563482680727352_563532474055706"
        type="rectangle"
        onPress={() => console.log('click')}
        onError={err => console.log('error', err)}
      />
    </View>
  );
}