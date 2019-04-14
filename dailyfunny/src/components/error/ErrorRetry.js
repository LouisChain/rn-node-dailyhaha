import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import Icon from "../../components/Icon"

export default function ErrorRetry(props) {

  return (
    <View style={[styles.container, props.containerStyle]}>
      <Text style={{justifyContent: "center", textAlign: 'center'}}>{props.errorMessage}</Text>
      <TouchableOpacity onPress={props.onRetry} style={{width: 32, height: 32}}>
        <Icon name="refresh"/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 38,
  }
})