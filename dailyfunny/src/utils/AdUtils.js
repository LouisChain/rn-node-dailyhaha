import {InterstitialAdManager} from "react-native-fbads";

export const showInterstitial = () => {
  InterstitialAdManager.showAd("563482680727352_564100533998900")
    .then(didClick => {
    })
    .catch(error => {
    });
}