import React from "react"
import {createBottomTabNavigator, createStackNavigator} from "react-navigation";
import Icon from "../components/IconBadge"
import {COLORS} from "../styles/styles";
import {
  FUNNYGAMES,
  FUNNYGIFS,
  FUNNYPICS,
  MAINTAB,
  GAMEPLAYER,
  FUNNYVIDEOS,
  PICDETAIL,
  GIFDETAIL,
  POLICY
} from "../constants/routeConstants";
import FunnyPictureScreen from "../screens/pic/funnyPicsScreen";
import FunnyGamesScreen from "../screens/game/funnyGameScreen";
import FunnyGifsScreen from "../screens/gif/funnyGifsScreen";
import FunnyVideosScreen from "../screens/video/funnyVideosScreen";
import GamePlayerScreen from "../screens/game/gamePlayerScreen";
import PicDetailScreen from "../screens/pic/zoomPicsScreen";
import GifPlayerScreen from "../screens/gif/gifPlayerScreen"
import PolicyScreen from "../screens/privacy/PolicyScreen";

const getTabName = (routeName) => {
  if(routeName === FUNNYPICS) {
    return "PICTURES";
  }
  if(routeName === FUNNYGIFS) {
    return "GIFS";
  }
  if(routeName === FUNNYVIDEOS) {
    return "VIDEOS";
  }
  if(routeName === FUNNYGAMES) {
    return "GAMES";
  }
  if(routeName === POLICY) {
    return "POLICY";
  }
  return "DEFAULT"
}


const BottomTabNavigator = createBottomTabNavigator(
  {
    [FUNNYPICS]: {
      screen: FunnyPictureScreen
    },
    [FUNNYGIFS]: {
      screen: FunnyGifsScreen
    },
    [FUNNYVIDEOS]: {
      screen: FunnyVideosScreen
    },
    [FUNNYGAMES]: {
      screen: FunnyGamesScreen
    },
    [POLICY]: {
      screen: PolicyScreen
    },
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      title: getTabName(navigation.state.routeName),
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === FUNNYPICS) {
          iconName = `picture-in-picture`;
        } else if (routeName === FUNNYGIFS) {
          iconName = `card-giftcard`;
        } else if (routeName === FUNNYGAMES) {
          iconName = `games`;
        } else if (routeName === FUNNYVIDEOS) {
          iconName = `ondemand-video`;
        } else if (routeName === POLICY) {
          iconName = `center-focus-strong`
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
    },
    [PICDETAIL]: {
      screen: PicDetailScreen
    },
    [GIFDETAIL]: {
      screen: GifPlayerScreen
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
