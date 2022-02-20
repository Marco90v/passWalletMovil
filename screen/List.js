import { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Button, FlatList, Heading, HStack, Icon, IconButton, Modal, ScrollView, Skeleton, Spacer, Spinner, Text, VStack } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt } from "../functions/encrypt";
import { saveFirebase } from "../config/firebase";
import Animated, { cos, Layout, SlideInLeft, SlideOutLeft, SlideOutRight } from "react-native-reanimated";
import { VirtualizedList } from "react-native";
import Lista from "./Lista";
import { set } from "firebase/database";


const List =  ({data,setData,uid,handledAccion}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [numItem, setNumItem] = useState("");
    const [preLoadList, setPreLoadList] = useState([]);

    useEffect(() => {
        const arr = [];
        for (let index = 0; index < 15; index++) {
            if(index === data.data.length) break;
            arr.push(data.data[index]);
        }
        setPreLoadList(arr);
        return () => {}
    }, []);
    
    const loadData = () => {
        const largo = preLoadList.length;
        const arr = [];
        for (let index = largo; index < largo+5; index++) {
            if(index === data.data.length) break;
            arr.push(data.data[index]);
        }
        setPreLoadList( e => { return [...e,...arr] } );
    }

    const save = () => {
        AsyncStorage.getItem("temp").then((e)=>{
            const datos = {data: data.data.filter((e,i)=>{return e.Name !== numItem && e})};
            const datos2 = preLoadList.filter((e,i)=>{return e.Name !== numItem && e});
            const enc = encrypt(datos,e);
            saveFirebase(datos,enc,setData,uid,undefined,undefined,datos2,setPreLoadList);
            setModalVisible(false);
        });
    }
    
    const handledModal = (i,n) => {
        setNumItem(i)
        setName(n);
        setModalVisible(!modalVisible);
    }

    const labelType = (t) => {
        switch (t) {
            case 0:
                return "Web Site";
            case 1:
                return "Bank Account";
            case 2:
                return "Cryptocurrencies";
            case 3:
                return "Note";
            default:
                return "ERROR";
        }
    }

    const lista = useCallback( ({item,index})=> {
        return(
            <Lista index={index} item={item} handledModal={handledModal} labelType={labelType} handledAccion={handledAccion} />
        )
    },[preLoadList]);

    const keyExtractor = (item)=>{
        return item.Name;
    };

    const spinnerGetData = () => {
        return data.data.length > preLoadList.length ?
            <HStack marginY={10} space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                <Heading color="primary.500" fontSize="md">Loading</Heading>
            </HStack>
            : <></>;
    }

    const Fl = () =>{
        return(
            <FlatList 
                w="100%" h="89%"
                scrollEnabled={true}
                data={preLoadList} 
                renderItem={ lista } 
                keyExtractor={ keyExtractor } 
                onEndReachedThreshold={.3}
                onEndReached={ loadData }
                ListFooterComponent={spinnerGetData}
                removeClippedSubviews={true}
                progressViewOffset={5}
            />
        );
    }

    return(
        <>
            { useMemo(()=>Fl(),[preLoadList]) }
            <Modal isOpen={modalVisible} onClose={setModalVisible} size="lg">
                <Modal.Content maxH="212">
                    <Modal.CloseButton />
                    <Modal.Header>Delete</Modal.Header>
                    <Modal.Body>
                        <ScrollView>
                            <Text>Do you want to delete the following item?</Text>
                            <Text bold>{name}</Text>
                        </ScrollView>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button size="lg" variant="ghost" colorScheme="blueGray" onPress={() => {
                                setModalVisible(false);
                            }}>
                                Cancel
                            </Button>
                            <Button size="lg" onPress={save}>Save</Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );

}




export default List;