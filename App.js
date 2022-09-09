import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useState, useEffect, useRef } from "react"
import { Linking } from "react-native";
import * as Notifications from 'expo-notifications'
import HomeScreen from './components/Home'
import CameraScreen from './components/CameraScreen'
import TransformationScreen from "./components/Transformation";
import * as FileSystem from 'expo-file-system'
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator()

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
})

export default function App() {

    const [expoPushToken, setExpoPushToken] = useState('')
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()

    const [transformations, setTransformations] = useState([])
    
    useEffect(() => {
        getTransformationData()
    }, [])

    // useEffect(async() => {
    //     try{
    //         const dir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
    //         console.log(dir)
    //     }
    //     catch(e){
    //         console.log(e)
    //     }
    // }, [])

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

    useEffect(() => {
        registerForPushNotifications().then(token => setExpoPushToken(token))
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification)
        })
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response)
        })
        return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
        }
    }, [])

    const registerForPushNotifications = async() => {

        let token;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        Linking.openURL('app-settings:')
            // alert('Failed to get push token for push notification!',
            //   'please enable push notifications',
            //   [
            //     { text: 'cancel', onPress: () => console.log('cancel')},
            //     { text: 'Allow', onPress: () => Linking.openURL('app-settings:')},
            //   ],
            //   { cancelable: false}
            //   );
            // return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        //console.log(token);

        return token;
    }

    async function sendPushNotification(expoPushToken) {
        const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        });
    }

    const addNewTransformation = (newName, newDays) => {
        const today = new Date()
        const currDate = parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
        const newTransformations = [
        {
            name: newName, 
            daysBetweenPhotos: newDays,
            startDate: currDate, 
            photoObjects: []
        },
        ...transformations]
        setTransformations(newTransformations)
        storeTransformationData(newTransformations)
    }

    const deleteTransformation = async(transformationName) => {
        const newTransformations = transformations.filter((transformation) => {
            return transformation.name !== transformationName
        })
        setTransformations(newTransformations)
        storeTransformationData(newTransformations)
    }

    const addNewPhoto = (newPic, transformationName) => {
        const newTransformations = transformations.map((transformation) => {
        if(transformation.name === transformationName){
            const today = new Date()
            const currDate = parseInt(today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
            const newPhotos = [{image: newPic, date: currDate}, ...transformation.photoObjects]
            return {...transformation, photoObjects: newPhotos}
        }
        else{
            return transformation
        }
        })
        setTransformations(newTransformations)
        storeTransformationData(newTransformations)
    }

    const deletePhotos = (removePhotos, transformationName) => {
        const newTransformations = transformations.map((transformation) => {
        if(transformation.name === transformationName){
            const newPhotos = transformation.photoObjects.filter(photo => photo.image !== removePhotos)
            return {...transformation, photoObjects: newPhotos}
        }
        else{
            return transformation
        }
        })
        setTransformations(newTransformations)
        storeTransformationData(newTransformations)
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
                deleteTransformation={deleteTransformation} 
                sendPushNotification={sendPushNotification}
                expoPushToken={expoPushToken}
                addNewTransformation={addNewTransformation}
                {...props}
            />}
            </Stack.Screen>

            <Stack.Screen
            name='Transformation'
            >
            {(props) => <TransformationScreen deletePhotos={deletePhotos} {...props}/>}
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

