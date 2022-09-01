import { View, TextInput, StyleSheet, Button } from 'react-native'
import { useState } from 'react';

export default function NewTransformationForm({navigation, addNewTransformation}) {

    const [transformationTitle, setTransformationTitle] = useState('')

    function submitForm(){
        if(transformationTitle){
            addNewTransformation(transformationTitle)
            navigation.navigate('Home')
        }
        else{
            alert("Enter a title!")
        }
    }

    return (
        <View>
            <TextInput
                style={styles.inputContainer}
                placeholder="Title of Transformation"
                onChangeText={(newTitle) => setTransformationTitle(newTitle)}
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