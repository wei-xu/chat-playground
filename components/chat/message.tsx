import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const styles = StyleSheet.create({

})

const Message = ({ msg }) => {
  return (
    <View>
      <Text style={{
        fontSize: 20
      }}>{msg}</Text>
    </View>
  )
}

export default Message