import React from "react";
import { View, Text } from "react-native";

export default function App(){
  return (
    <View style={{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#0b0c10"}}>
      <Text style={{color:"#e6e9ef",fontSize:22,fontWeight:"700"}}>CASADF Mobile MVP</Text>
      <Text style={{color:"#9aa3b2",marginTop:8}}>Expo scaffold. Conecte com sua API.</Text>
    </View>
  );
}
