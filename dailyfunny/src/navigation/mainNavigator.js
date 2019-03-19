import React from "react"
import {createBottomTabNavigator, createStackNavigator} from "react-navigation";
import FunnyPictureScreen from "../screens/maintab/funnyPicsScreen";
import FunnyGamesScreen from "../screens/game/funnyGameScreen";
import FunnyGifsScreen from "../screens/maintab/funnyGifsScreen";
import {FUNNYGAMES, FUNNYGIFS, FUNNYPICS, MAINTAB, GAMEPLAYER} from "../constants/routeConstants";
import Icon from "../components/IconBadge_"
import {COLORS} from "../styles/styles";
import GamePlayerScreen from "../screens/game/gamePlayerScreen";

const BottomTabNavigator = createBottomTabNavigator(
  {
    [FUNNYPICS]: {
      screen: FunnyPictureScreen
    },
    [FUNNYGIFS]: {
      screen: FunnyGifsScreen
    },
    [FUNNYGAMES]: {
      screen: FunnyGamesScreen
    }
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      title: navigation.state.routeName === FUNNYPICS ? "PICTURES" : navigation.state.routeName === FUNNYGIFS ? "GIFS" : "GAMES",
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === FUNNYPICS) {
          iconName = `picture-in-picture`;
        } else if (routeName === FUNNYGIFS) {
          iconName = `card-giftcard`;
        } else if (routeName === FUNNYGAMES) {
          iconName = `games`;
        }
        return <Icon name={iconName} color={tintColor}/>;
      },
    }),
    tabBarOptions: {
      activeTintColor: COLORS.activeColor,
      inactiveTintColor: COLORS.inactiveColor,
    },
    initialRouteName: FUNNYPICS,
    tabBarPosition: 'bottom'
  }
);

const MainNavigator = createStackNavigator(
  {
    [MAINTAB]: {
      screen: BottomTabNavigator
    },
    [GAMEPLAYER]: {
      screen: GamePlayerScreen
    }
  },
  {
    headerMode: "none",
    // navigationOptions: {
    //   headerVisible: false
    // }
  }
);

export default MainNavigator;
