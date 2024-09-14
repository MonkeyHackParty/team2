import React, { useState, useEffect } from 'react';
import { View, Image, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const Main = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { text } = route.params;
    const [imageData, setImageData] = useState(null);
    const [position, setPosition] = useState({ fX: -1, fY: -1, sX: -1, sY: -1 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [errortext, setErrortext] = useState('');

    useEffect(() => {
        const base64Image = sessionStorage.getItem('imageData');
        setImageData(base64Image);
    }, []);

    const handleClick = (event) => {
        const { locationX, locationY } = event.nativeEvent;

        setPosition(prevPosition => {
            if (isDrawing) {
                return { ...prevPosition, fX: locationX, fY: locationY };
            } else {
                return { ...prevPosition, sX: locationX, sY: locationY };
            }
        });
    };

    const onSubmit = () => {
        const { fX, fY, sX, sY } = position;
        if (fX === -1 || fY === -1 || sX === -1 || sY === -1) {
            setErrortext("please check all");
        } else {
            const submitdata = {
                image: imageData,
                text: text,
                fX: fX,
                fY: fY,
                sX: sX,
                sY: sY
            };

            axios.post('http://localhost:5000/api/data/post', submitdata)
                .then(() => {
                    sessionStorage.removeItem('imageData');
                    setImageData(null);
                    navigation.navigate('Page4');
                })
                .catch(error => {
                    console.error('Error submitting data:', error);
                });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inout}>
                <Button title="IN" onPress={() => setIsDrawing(false)} />
                <Button title="OUT" onPress={() => setIsDrawing(true)} />
            </View>
            <TouchableOpacity style={styles.imageContainer} onPress={handleClick}>
                <Image source={{ uri: imageData }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.decision}>
                <Button title="決定" onPress={onSubmit} />
                {errortext ? <Text style={styles.errorText}>{errortext}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    inout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    decision: {
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default Main;
