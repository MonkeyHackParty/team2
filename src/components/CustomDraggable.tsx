import React, { useState, ReactNode } from "react";
import { View, PanResponder } from "react-native";

interface CustomDraggableProps {
  children: ReactNode;
  x?: number;
  y?: number;
}

const CustomDraggable: React.FC<CustomDraggableProps> = ({
  children,
  x = 0,
  y = 0,
}) => {
  const [position, setPosition] = useState({ x, y });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setPosition({
          x: position.x + gestureState.dx,
          y: position.y + gestureState.dy,
        });
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      {children}
    </View>
  );
};

export default CustomDraggable;
