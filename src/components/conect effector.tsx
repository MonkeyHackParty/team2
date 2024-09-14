import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';  
import { useNavigation } from '@react-navigation/native';

const Main = () => {
    const [sidedata, setSidedata] = useState([]);
    const [maindata, setMaindata] = useState([]);
    const [inPosition, setInPosition] = useState({ x: -1, y: -1 });
    const [outPosition, setOutPosition] = useState({ x: -1, y: -1 });
    const [inoutarray, setInoutarray] = useState([]);
    const [clickcount, setClickcount] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        axios.get('http://localhost:5000/api/data/get')
            .then(response => {
                const getdata = response.data.data.map((res) => ({
                    id: res.id,
                    image: res.image,
                    text: res.text,
                    fX: res.fX,
                    fY: res.fY,
                    sX: res.sX,
                    sY: res.sY
                }));
                setSidedata(getdata);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleClickimage = (id) => {
        const clickimages = sidedata.find(item => item.id === id);
        setMaindata([...maindata, clickimages]);
        setSidedata(sidedata.filter(item => item.id !== id));
    };

    const selection = (event, id) => {
        setClickcount((clickcount + 1) % 3);
        const x = event.nativeEvent.pageX;
        const y = event.nativeEvent.pageY;

        const clickimages = maindata.find(item => item.id === id);
        if (clickcount % 3 === 0) {
            setInPosition({
                x: x + clickimages.fX,
                y: y + clickimages.fY,
            });
        } else if (clickcount % 3 === 1) {
            setOutPosition({
                x: x + clickimages.sX,
                y: y + clickimages.sY
            });
        } else {
            setInPosition({ x: -1, y: -1 });
            setOutPosition({ x: -1, y: -1 });
        }
    };

    const describe = () => {
        setClickcount(0);

        const position = {
            fX: inPosition.x,
            fY: inPosition.y,
            sX: outPosition.x,
            sY: outPosition.y
        };

        setInoutarray([...inoutarray, position]);

        setInPosition({ x: -1, y: -1 });
        setOutPosition({ x: -1, y: -1 });
    };

    const handleClick = () => {
        // React Native ではスクリーンショットを撮るにはライブラリが必要
        navigation.navigate('Page5');  // react-navigation の使用
    };

    const firstpage = () => {
        navigation.navigate('Home');  // 例：最初のページに戻る
    };

    return (
        <View style={styles.container}>
            <Text>{clickcount}</Text>
            <View style={styles.sidebar}>
                {sidedata.map(item => (
                    <TouchableOpacity key={item.id} onPress={() => handleClickimage(item.id)}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text>{item.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.mainContent}>
                {maindata.map(item => (
                    <TouchableOpacity key={item.id} onPress={(event) => selection(event, item.id)}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text>{item.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity onPress={describe}>
                <Text>決定</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClick}>
                <Text>この画像で確定する</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={firstpage}>
                <Text>他の画像を追加する</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    sidebar: { flex: 1 },
    mainContent: { flex: 3 },
    image: { width: 100, height: 100 }
});

export default Main;
