import { Text, TextInput, View, Button, Image, ScrollView, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'

export default function Transformation({navigation, route, clearData}) {
    const {transformationName, photos} = route.params
    return (
        <View>
            <FlatList
                data={photos}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                renderItem={({item}) => {
                    return <View style={{marginHorizontal:50, justifyContent: 'center', alignItems:'center'}}>
                            <Image source={{uri: item}} 
                            style={{width:200, height:400, borderRadius:16}}
                            />
                        </View>
                }}
            />
            <Button title='remove' onPress={() => clearData()}/>
            <Button title='Add Photo' onPress={() => navigation.navigate('Camera', {
                transformationName: transformationName
            })}/>
        </View>
    )
//   return (
//       <ScrollView>
//         {photos && photos.map((photo) => {
//             return (
//                 <Image source={{uri : photo}} style={{ width:100, height:200}}/>
//             )
//         })}
//         <Button title='remove' onPress={() => clearData()}/>
//       </ScrollView>
//   )
}
