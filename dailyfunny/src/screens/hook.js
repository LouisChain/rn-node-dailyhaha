import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";

function HookScreen() {
  const [text, setText] = useState("");
  const [no, setNo] = useState(0);

  useEffect(() => {
      console.log("Call when text changed!");
    }, [text]
  );

  useEffect(() => {
      console.log("Call when no changed!");
    }, [no]
  );

  useEffect(() => {
      console.log("Call one time");
    }, []
  );

  useEffect(() => {
      console.log("Call every time state change");
    }
  );

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>Hello react native Hooks</Text>
      {console.log("rendering")}
    </View>
  )
}

export default HookScreen