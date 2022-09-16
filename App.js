import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useState, useEffect } from "react"
import HomeScreen from './components/Home'
import CameraScreen from './components/CameraScreen'
import TransformationScreen from "./components/Transformation";
import VideoScreen from "./components/VideoScreen";
import * as FileSystem from 'expo-file-system'
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator()

export default function App() {

    const [transformations, setTransformations] = useState([])

    useEffect(() => {
        getTransformationData()
    }, [])

    const getTransformationData = async() => {
        const { exists } = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'transformations.json')
        if(!exists){
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'transformations.json', JSON.stringify(transformations))
        }
        try{
            const transformationData = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'transformations.json')
            if(transformationData !== null){
                setTransformations(JSON.parse(transformationData))
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const storeTransformationData = async(newTransformation) => {
        try{
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'transformations.json', JSON.stringify(newTransformation))
        }
        catch(e){
            console.log(e)
        }
    }

    const updateTransformations = (newTransformations) => {
        setTransformations(newTransformations)
        storeTransformationData(newTransformations)
    }

    const updatePhotoObjects = (transformationId, newPhotos) => {
        const newTransformations = transformations.map((transformation) => {
            if(transformation.id === transformationId){
                return {...transformation, photoObjects: newPhotos}
            }
            else{
                return transformation
            }
        })
        updateTransformations(newTransformations)
    }

    return (
        <NavigationContainer>
        <StatusBar
            style="light"
        />
        <Stack.Navigator
        screenOptions={{headerShown: false}}
        >

            <Stack.Screen
            name='Home'
            >
            {(props) => 
            <HomeScreen 
                transformations={transformations} 
                updateTransformations={updateTransformations} 
                {...props}
            />}
            </Stack.Screen>

            <Stack.Screen
            name='Transformation'
            >
            {(props) => 
            <TransformationScreen 
                updatePhotoObjects={updatePhotoObjects}
                {...props}
            />}
            </Stack.Screen>

            <Stack.Screen
            name='Camera'
            >
            {(props) => <CameraScreen {...props}/>}
            </Stack.Screen>

            <Stack.Screen
            name='Video'
            >
            {(props) => <VideoScreen  {...props}/>}
            </Stack.Screen>

        </Stack.Navigator>
        </NavigationContainer>
    )

}

