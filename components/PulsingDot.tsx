import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.15,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#f1c40f',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});