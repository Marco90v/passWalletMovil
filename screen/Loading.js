import { Center, NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const Loading = () => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
          withTiming(360, {
            duration: 800,
            easing: Easing.linear,
          }),
          200
        );
        return () => cancelAnimation(rotation);
      }, []);

    const ShareValues = () =>{
        const animatedStyles = useAnimatedStyle(() => {
            return {
              transform: [
                {
                  rotateZ: `${rotation.value}deg`,
                },
              ],
            };
          }, [rotation.value]);

        return(
            <Animated.View style={[style.sAnimated, animatedStyles]} />
        );
    }

    return(
        <NativeBaseProvider>
            <Center style={{flex:1}}>
                <ShareValues />
            </Center>
        </NativeBaseProvider>
    );
}

const style = StyleSheet.create({
    sAnimated:{
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 7,
        borderTopColor: '#f5f5f5',
        borderRightColor: '#f5f5f5',
        borderBottomColor: '#f5f5f5',
        borderLeftColor: '#ffe500',
    }
});

export default Loading;