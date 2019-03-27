import React, {useState} from "react";
import {Text, TouchableHighlight} from "react-native";

export default function Button(props) {
  const [pressStatus, setPressStatus] = useState(false);

  const _onHideUnderlay = () => {
    // setPressStatus(false);
  }
  const _onShowUnderlay = () => {
    setPressStatus(!pressStatus);
  }

  return (
    <TouchableHighlight
      activeOpacity={1}
      underlayColor={props.pressed.button.backgroundColor}
      style={
        pressStatus
          ? props.pressed.button
          : props.normal.button
      }
      onHideUnderlay={_onHideUnderlay}
      onShowUnderlay={_onShowUnderlay}
      onPress={props.onPress}
    >
      <Text
        style={
          pressStatus
            ? props.pressed.text
            : props.normal.text
        }
      >
        {props.text}
      </Text>
    </TouchableHighlight>
  );
}


