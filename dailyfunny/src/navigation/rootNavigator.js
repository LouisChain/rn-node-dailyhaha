import React, { Component } from "react";
import { Platform } from "react-native";
import {
  createAppContainer,
  createSwitchNavigator
} from "react-navigation";
import NavigationService from "../utils/NavigationService";
import { MAIN } from "../constants/routeConstants";
import MainNavigator from "./mainNavigator";

const prefix =
  Platform.OS === "android" ? "casioapp://casioapp/" : "casioapp://";

export default class RootComponent extends Component {
  render() {
    return (
      <RootContainer
        ref={navigatorRef =>
          NavigationService.setTopLevelNavigator(navigatorRef)
        }
        uriPrefix={prefix}
      />
    );
  }
}

const RootNavigator = createSwitchNavigator(
  {
    [MAIN]: MainNavigator
  },
  {
    initialRouteName: MAIN
  }
);

const RootContainer = createAppContainer(RootNavigator);
