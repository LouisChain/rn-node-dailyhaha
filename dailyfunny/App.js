/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from "react";
import reduxStore from "./src/store/reduxStore"
import {Provider} from "react-redux"

import RootContainer from "./src/navigation/rootNavigator";

// console.disableYellowBox = true; // disables the yellow warning box
// louis comment for test
export default class App extends Component {
  render() {
    return (
      <Provider store={reduxStore}>
        <RootContainer/>
      </Provider>
    );
  }
}
