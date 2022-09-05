import { View, Button, Image, FlatList, StyleSheet, Text } from 'react-native'
import { useState } from 'react'
import Feather from '@expo/vector-icons/Feather'
//import { FFmpegKit } from 'ffmpeg-kit-react-native'

export default function Transformation({navigation, deletePhotos, route}) {
    const {name, photoObjects} = route.params
    const [currentPhotoObjects, setCurrentPhotoObjects] = useState(photoObjects)

    const addToCurrentPhotos = (newPic) => {
        const today = new Date()
        const currDate = parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
        setCurrentPhotoObjects(prevPhotos => [{image: newPic, date: currDate}, ...prevPhotos])
    }

    function createVideo(){
        // const createMe = '-i ' + currentPhotoObjects[0].image + ' -c:v mpeg4 output.mp4'
        // FFmpegKit.execute(createMe).then(async(session) =>{
        //     const logs = await session.getOutput()
        //     console.log(logs)
            
        // })
    }

    return (
        <View style={styles.transformationContainer}>
            <Feather 
                name='plus-circle' 
                size={36} 
                color={'gray'}
                onPress={() => navigation.navigate('Camera', {
                    name: name,
                    lastPhoto: currentPhotoObjects.at(-1)?.image,
                    addToCurrentPhotos: addToCurrentPhotos
                })}
                style={{padding: 10, paddingTop: 40, alignSelf:'flex-end'}}
            />
            <FlatList
                data={currentPhotoObjects}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => {
                    return (
                        <View style={{marginHorizontal: 15, justifyContent: 'center', alignItems:'center'}}>
                            <Image source={{uri: item.image}} 
                            style={{width:200, height:400, borderRadius:16}}
                            />
                            <Text>{item.date}</Text>
                            <Button title='remove' onPress={() => {
                                setCurrentPhotoObjects((prevPhotos) => prevPhotos.filter((photo) => photo.image !== item.image))
                                deletePhotos(item.image, name)
                            }}/>
                        </View>
                    )
                }}
            />
            <Button
                title='Export Video'
                onPress={() => createVideo()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    transformationContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    }
})