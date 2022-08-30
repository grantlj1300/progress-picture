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

  const [photos, setPhotos] = useState([])
  useEffect(() => {
    getData()
  }, [photos])

  const addNewPhoto = (newPic) => {
    newPhotos = [...photos, newPic]
    setPhotos(newPhotos)
    storeData(newPhotos)
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
        const images = await AsyncStorage.getItem('images')
        if(images !== null) {
          setPhotos(JSON.parse(images))
        }
    }
    catch(e){
        console.log(e)
    }
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
          component={HomeScreen}
        />

        <Stack.Screen
          name='New Transformation'
          component={NewTransformationFormScreen}
        /> 

        <Stack.Screen
          name='Transformation'
        >
          {(props) => <TransformationScreen photos={photos} clearData={clearData} {...props}/>}
        </Stack.Screen>

        <Stack.Screen
          name='Camera'
        >
          {(props) => <CameraScreen addNewPhoto={addNewPhoto} {...props}/>}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  )

}

