import React from 'react'

import {createIconSet} from 'react-native-vector-icons'

import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Zocial from 'react-native-vector-icons/Zocial'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {COLORS, ICON} from "../styles/styles";
// import { m3IconName, Mingalabar } from '@components/Mingalabar'

let DEFAULT_ICON_SET = "MaterialIcons"//m3IconName;
let DEFAULT_ICON_SIZE = ICON.large;
let DEFAULT_ICON_COLOR = COLORS.activeColor;

const ICON_SETS = {
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Foundation,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  Zocial,
  SimpleLineIcons
};

const addIconSet = (iconSet, glyphMap, fontFamily, fontFile) => {
  ICON_SETS[iconSet] = createIconSet(glyphMap, fontFamily, fontFile)
}

const setDefaultIconSet = (iconSet) => {
  DEFAULT_ICON_SET = iconSet
}

function Icon(props) {

  const {name, color, size, set, containerStyle} = props;
  const iconSize = size || DEFAULT_ICON_SIZE;
  const iconColor = color || DEFAULT_ICON_COLOR;
  const iconStyle = containerStyle || {};
  const IconView = ICON_SETS[set || DEFAULT_ICON_SET];
  return (
    <IconView style={iconStyle}
              color={iconColor}
              name={name}
              size={iconSize}/>
  )
}

export default Icon;