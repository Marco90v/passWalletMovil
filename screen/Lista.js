import React from "react";
import { Box, HStack, Icon, IconButton, Spacer, Text, VStack } from "native-base";
import Animated, { Layout, SlideInLeft, SlideOutLeft, SlideOutRight } from "react-native-reanimated";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


class Lista extends React.Component {

    
    shouldComponentUpdate(){
        return false;
    }
    
    render() {
        const {item,handledModal,labelType,handledAccion} = this.props;
        return(
            <Animated.View 
                key={item.Name}
                entering={SlideInLeft} 
                exiting={SlideOutRight}
                style={{borderBottomWidth:1, borderColor:"#e5e7eb", paddingLeft:4, paddingRight:5, paddingVertical:10}}
            >
                <HStack space={3} justifyContent="space-between" >
                    <IconButton icon={<Icon size="sm" as={MaterialIcons} name="delete" />}
                        onPress={()=>handledModal(item.Name,item.Name)}
                        _icon={{color:"rgb(255, 0, 0)"}}
                    />
                    <VStack >
                        <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold >{item.Name}</Text>
                        <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>{labelType(item.type)}</Text>
                    </VStack>
                    <Spacer />
                    <IconButton icon={<Icon size="sm" as={MaterialIcons} name="description" />}
                        onPress={()=>handledAccion(2,item.Name)}
                        _icon={{color:"#00d000"}}
                    />
                </HStack>
            </Animated.View>
        )
    }
}

export default Lista;