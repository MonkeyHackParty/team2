import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface CirclePosition {
  x: number;
  y: number;
  label: 'IN' | 'OUT';
}

const Main = () => {
  const [circlePositions, setCirclePositions] = useState<CirclePosition[]>([]);
  const [isDrawing, setIsDrawing] = useState<'IN' | 'OUT' | null>(null);

  // 画像URLをここで指定
  const imageData = 'https://store.shimamura.co.jp/ec/img/261/tp261-01012/tp261-0101291/tp261-0101291.jpg';

  const tolerance = 50; // 調整可能なトレランス値

  const isCloseToExistingCircle = (x: number, y: number) => {
    return circlePositions.some(circle => {
      const distance = Math.sqrt(
        Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2)
      );
      return distance < tolerance;
    });
  };

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;

    if (isDrawing) {
      if (isCloseToExistingCircle(locationX, locationY)) {
        // 既存の円に近い場合はその円を削除
        setCirclePositions(prevPositions =>
          prevPositions.filter(circle =>
            Math.sqrt(
              Math.pow(circle.x - locationX, 2) + Math.pow(circle.y - locationY, 2)
            ) >= tolerance
          )
        );
      } else {
        // 新しい円を追加
        setCirclePositions(prevPositions => [
          ...prevPositions,
          { x: locationX, y: locationY, label: isDrawing },
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inout}>
        <TouchableOpacity onPress={() => setIsDrawing('IN')} style={styles.button}>
          <Text>IN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsDrawing('OUT')} style={styles.button}>
          <Text>OUT</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer} onStartShouldSetResponder={() => true} onResponderRelease={handlePress}>
        <Image source={{ uri: imageData }} style={styles.image} />
        {/* 円の描画 */}
        {circlePositions.map((circle, index) =>
          renderCircle(circle.x, circle.y, circle.label)
        )}
      </View>
    </View>
  );
};

const renderCircle = (x: number, y: number, text: string) => (
  <View
    style={[
      styles.circle,
      {
        left: x - 50, // 中心に合わせるために調整
        top: y - 50,  // 中心に合わせるために調整
        position: 'absolute',
      },
    ]}
  >
    <Text style={styles.circleText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inout: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  imageContainer: {
    position: 'relative',
    width: 600, // 画像の幅を指定
    height: 600, // 画像の高さを指定
  },
  image: {
    width: '100%',
    height: '100%',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // 半透明の赤
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Main;
