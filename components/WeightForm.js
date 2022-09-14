import { View, TextInput, StyleSheet, Modal, Button } from 'react-native'
import { useState } from 'react';

export default function WeightForm({ weightFormChanging, handleWeightFormChange, weightLabel, editPhotoWeight, image }) {

    const [weight, setWeight] = useState('')

    function submitForm(){
        if(!weight){
            alert("If you don't want to enter your weight, press cancel")
            return
        }
        const newWeight = weight + " " + weightLabel
        editPhotoWeight(image, newWeight)
        handleWeightFormChange()
    }

    return (
        <Modal
            animationType='fade'
            visible={weightFormChanging}
            transparent={true}
            onRequestClose={() => handleWeightFormChange()}
        >
            <View style={styles.screenContainer}>
                <View style={styles.formContainer}>
                    <View>
                        <TextInput
                            style={styles.inputContainer}
                            keyboardType='numeric'
                            contextMenuHidden={true}
                            placeholder={"Weight (" + weightLabel + ")"}
                            onChangeText={(newWeight) => setWeight(newWeight)}
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Button
                            title='Cancel'
                            onPress={() => handleWeightFormChange()}
                        />
                        <Button
                            title='Submit'
                            onPress={() => submitForm()}
                        /> 
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#00000080'
    },
    formContainer: {
        padding: 20, 
        width: 300, 
        minHeight: 0,
        justifyContent: 'space-between',
        backgroundColor: '#fff', 
    },
    inputContainer: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    }
})