import { Text, TextInput, View, Button, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'

export default function Transformation({photos, clearData}) {
    
  return (
      <ScrollView>
        {photos && photos.map((photo) => {
            return (
                <Image source={{uri : photo}} style={{ width:100, height:200}}/>
            )
        })}
        <Button title='remove' onPress={() => clearData()}/>
      </ScrollView>
  )
}
