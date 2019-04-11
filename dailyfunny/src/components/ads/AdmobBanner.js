import DeviceInfo from "react-native-device-info";
import {AdMobBanner} from "react-native-admob";
import React from "react";

export default function AdMobBannerView(props) {
  return <AdMobBanner
    style={{marginBottom: 50}}
    adSize="banner"
    adUnitID="ca-app-pub-2350916781050098/1822411774"
    testDevices={[DeviceInfo.getDeviceId()]}
  />
}