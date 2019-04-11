import React, {Component} from 'react';
import {Text, View, Dimensions} from 'react-native';
import {
  withNativeAd,
  AdIconView,
  TriggerableView,
  MediaView, AdSettings, NativeAdsManager
} from 'react-native-fbads';

const {width} = Dimensions.get('window');

class NativeAdView extends Component<Props> {
  render() {
    return (
      <View style={{flexDirection: 'column', borderWidth: 1}}>
        <MediaView style={{width: width - 42, height: width / 2}}/>
        <View style={{flexDirection: 'row'}}>
          <AdIconView style={{width: 80, height: 80}}/>
          <View
            style={{flexDirection: 'column', paddingHorizontal: 10, flex: 1}}
          >
            <TriggerableView style={{fontSize: 18}}>
              {this.props.nativeAd.headline}
            </TriggerableView>
            <Text>{this.props.nativeAd.sponsoredTranslation}</Text>
            <TriggerableView style={{fontSize: 10}}>
              {this.props.nativeAd.linkDescription}
            </TriggerableView>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <TriggerableView
            style={{
              fontSize: 15,
              color: '#a70f0a',
              paddingVertical: 10,
              paddingHorizontal: 30,
              elevation: 3,
              borderTopWidth: 0,
              margin: 10,
              borderRadius: 6,
            }}
          >
            {this.props.nativeAd.callToActionText}
          </TriggerableView>
        </View>
      </View>
    );
  }
}

const AdView = withNativeAd(NativeAdView);

AdSettings.clearTestDevices();
// AdSettings.setLogLevel('debug');
// AdSettings.addTestDevice(AdSettings.currentDeviceHash);

const adsManager = new NativeAdsManager("563482680727352_563738220701798");

export default class NativeAd extends React.Component<Props> {
  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: 20,
        }}
      >
        <AdView adsManager={adsManager} adChoicePosition="bottomRight"/>
      </View>
    );
  }
}


