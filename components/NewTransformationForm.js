import { View, TextInput, StyleSheet, Modal, Button } from 'react-native'
import { useState } from 'react';

export default function NewTransformationForm({ creatingNewTransformation, handleCreateTransformationChange, addNewTransformation }) {

    const [transformationTitle, setTransformationTitle] = useState('')
    const [daysBetweenPhotos, setDaysBetweenPhotos] = useState('')

    function submitForm(){
        if(daysBetweenPhotos < 1){
            alert("Days between photos must be greater than 0!")
            return
        }
        if(transformationTitle){
            addNewTransformation(transformationTitle, daysBetweenPhotos)
            handleCreateTransformationChange()
        }
        else{
            alert("Enter a title!")
        }
    }

    return (
        <Modal
            animationType='fade'
            visible={creatingNewTransformation}
            transparent={true}
            onRequestClose={() => handleCreateTransformationChange()}
        >
            <View style={{backgroundColor: '#00000080', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{backgroundColor: '#fff', padding: 20, width: 300, height: 300}}>
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
                        title='Cancel'
                        onPress={() => handleCreateTransformationChange()}
                    />
                    <Button
                        title='Submit'
                        onPress={() => submitForm()}
                    /> 
                </View>
            </View>
        </Modal>
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