import { NavigationActions } from "react-navigation";

/*
 * Purpose of this file is to grant the higher level navigator the navigation prop to allow navigation. Useful for Firebase component where we
 * place the listeners on the root navigator
 *
 * reference: https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
 *
 * */

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator
};
