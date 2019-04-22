import React from "react"
import {View} from "react-native";
import {BannerView} from 'react-native-fbads';
import {AdSettings} from 'react-native-fbads';
import * as Console from "../../utils/logger"

// AdSettings.addTestDevice(AdSettings.currentDeviceHash);
AdSettings.clearTestDevices();

export default function ViewWithBanner(props) {
  return (
    <View>
      <BannerView
        placementId="563482680727352_563530964055857"
        type="standard"
        onError={err => Console.log("FBAds", err + "")}
      />
    </View>
  );
}