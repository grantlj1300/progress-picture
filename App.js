import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useState, useEffect } from "react"
import HomeScreen from './components/Home'
import CameraScreen from './components/CameraScreen'
import TransformationScreen from "./components/Transformation";
import NewTransformationFormScreen from "./components/NewTransformationForm";
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createNativeStackNavigator()

export default function App() {

  const [transformations, setTransformations] = useState([])
  const [photos, setPhotos] = useState([])
  
  useEffect(() => {
    getData()
  }, [])

  const addNewTransformation = (newTransformationName) => {
    const newTransformations = [...transformations, 
      {transformationName: newTransformationName, photos: []}]
    setTransformations(newTransformations)
    storeTransformationData(newTransformations)
  }

  const storeTransformationData = async(newTransformation) => {
    try{
        await AsyncStorage.setItem('transformations', JSON.stringify(newTransformation))
    }
    catch(e){
        console.log(e)
    }
  }

  const deleteTransformation = async(transformationName) => {
    try{
      const newTransformations = transformations.filter((transformation) => {
        return transformation.transformationName !== transformationName
      })
      setTransformations(newTransformations)
      await AsyncStorage.setItem('transformations', JSON.stringify(newTransformations))
    }
    catch(e){
      console.log(e)
    }
  }

  const addNewPhoto = (newPic, transformationName) => {
    const newTransformations = transformations.map((transformation) => {
      if(transformation.transformationName === transformationName){
        const newPhotos = [...transformation.photos, newPic]
        return {transformationName: transformationName, photos: newPhotos}
      }
      else{
        return transformation
      }
    })
    setTransformations(newTransformations)
    storeTransformationData(newTransformations)
  }

  const storeData = async(images) => {
    try{
        await AsyncStorage.setItem('images', JSON.stringify(images))
    }
    catch(e){
        console.log(e)
    }
  }

  const getData = async() => {
      try{
        const transformations = await AsyncStorage.getItem('transformations')
        if(transformations !== null) {
          setTransformations(JSON.parse(transformations))
        }
      }
      catch(e){
        console.log(e)
      }
    // try{
    //     const images = await AsyncStorage.getItem('images')
    //     if(images !== null) {
    //       setPhotos(JSON.parse(images))
    //     }
    // }
    // catch(e){
    //     console.log(e)
    // }
  }

  const clearData = async() => {
    try{
      await AsyncStorage.removeItem('images')
      setPhotos([])
    }
    catch(e){
      console.log(e)
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name='Home'
        >
          {(props) => <HomeScreen transformations={transformations} deleteTransformation={deleteTransformation} {...props}/>}
        </Stack.Screen>

        <Stack.Screen
          name='New Transformation'
        >
          {(props) => <NewTransformationFormScreen addNewTransformation={addNewTransformation} {...props}/>}
        </Stack.Screen> 

        <Stack.Screen
          name='Transformation'
        >
          {(props) => <TransformationScreen  clearData={clearData} {...props}/>}
        </Stack.Screen>

        <Stack.Screen
          name='Camera'
        >
          {(props) => <CameraScreen addNewPhoto={addNewPhoto} lastPhoto={photos.at(-1)} {...props}/>}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  )

}

