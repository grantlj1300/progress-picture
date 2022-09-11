import { View, TextInput, Text, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native'
import { useState } from 'react';

export default function NewTransformationForm({ creatingNewTransformation, handleCreateTransformationChange, addNewTransformation }) {

    const [transformationTitle, setTransformationTitle] = useState('')
    const [daysBetweenPhotos, setDaysBetweenPhotos] = useState('')
    const [trackWeight, setTrackWeight] = useState(false)
    const [poundsOrKilos, setPoundsOrKilos] = useState(' lbs')

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
                <View style={{backgroundColor: '#fff', padding: 20, width: 300, height: 300, justifyContent: 'space-between'}}>
                    <View>
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
                        <TouchableOpacity
                            onPress={() => setTrackWeight(prevStatus => !prevStatus)}
                            style={{flexDirection: 'row', alignItems: 'center'}}
                        >
                            <View style={styles.radioBox}>
                                {
                                trackWeight ?
                                    <View style={styles.selectedRadioBox}/>
                                    : null
                                }
                            </View>
                            <Text style={{paddingLeft: 5}}>Track Weight</Text>
                        </TouchableOpacity>
                        {trackWeight &&
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={() => setPoundsOrKilos(' lbs')}
                                style={{flexDirection: 'row', alignItems: 'center'}}
                            >
                                <View style={styles.radioBox}>
                                    {
                                    poundsOrKilos === ' lbs' ?
                                    <View style={styles.selectedRadioBox}/>
                                        : null
                                    }
                                </View>
                                <Text style={{paddingLeft: 5}}>Pounds (lbs)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPoundsOrKilos(' kg')}
                                style={{flexDirection: 'row', alignItems: 'center'}}
                            >
                                <View style={styles.radioBox}>
                                    {
                                    poundsOrKilos === ' kg' ?
                                    <View style={styles.selectedRadioBox}/>
                                        : null
                                    }
                                </View>
                                <Text style={{paddingLeft: 5}}>Kilograms (kg)</Text>
                            </TouchableOpacity>
                        </View>
                        }
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
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
    },
    radioBox: {
        height: 20,
        width: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedRadioBox: {
        height: 10,
        width: 10,
        borderRadius: 6,
        backgroundColor: 'blue'
    }
  });