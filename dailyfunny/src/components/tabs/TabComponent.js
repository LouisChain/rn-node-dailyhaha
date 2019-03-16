import React from "react";
import {Text, View} from "react-native";
import {SafeAreaView, BottomTabBar} from "react-navigation";

function TabComponent(props) {

  // return (
  //   <View>
  //     <SafeAreaView forceInset={{bottom: 'always'}}>
  //       <Text>
  //         Hello Tabs
  //       </Text>
  //     </SafeAreaView>
  //   </View>
  // );
  return <BottomTabBar {...props}/>
}

const styles = {}

export default TabComponent;