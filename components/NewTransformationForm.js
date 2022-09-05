import { View, TextInput, StyleSheet, Button } from 'react-native'
import { useState } from 'react';

export default function NewTransformationForm({navigation, addNewTransformation}) {

    const [transformationTitle, setTransformationTitle] = useState('')
    const [daysBetweenPhotos, setDaysBetweenPhotos] = useState('')

    function submitForm(){
        if(daysBetweenPhotos < 1){
            alert("Days between photos must be greater than 0!")
            return
        }
        if(transformationTitle){
            addNewTransformation(transformationTitle, daysBetweenPhotos)
            navigation.navigate('Home')
        }
        else{
            alert("Enter a title!")
        }
    }

    return (
        <View style={{paddingTop: 40}}>
            <TextInput
                style={styles.inputContainer}
                placeholder="Title of Transformation"
                onChangeText={(newTitle) => setTransformationTitle(newTitle)}
            />
            <TextInput
                style={styles.inputContainer}
                keyboardType='number-pad'
                contextMenuHidden={true}
                placeholder="Days Between Photos"
                onChangeText={(newDays) => setDaysBetweenPhotos(newDays)}
            />
            <Button
                title="Submit"
                onPress={submitForm}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    }
  });