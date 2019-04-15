import React from "react"
import {View} from "react-native";
import {BannerView} from 'react-native-fbads';
import {AdSettings} from 'react-native-fbads';

// AdSettings.addTestDevice(AdSettings.currentDeviceHash);

export default function ViewWithBanner(props) {
  return (
    <View>
      <BannerView
        placementId="563482680727352_563530964055857"
        type="standard"
        onPress={() => console.log('click')}
        onError={err => console.log('error', err)}
      />
    </View>
  );
}