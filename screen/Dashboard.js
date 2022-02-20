import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"
import { decrypt } from "../functions/encrypt";
import { Actionsheet, Box, Button, HStack, Icon, IconButton, Modal, ScrollView, Skeleton, Text, useDisclose, View } from "native-base";
import { useEffect, useMemo, useState } from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import List from "./List";
import { getAuth, signOut } from "firebase/auth";
import New from "./New";
import SeeEdit from "./SeeEdit";
import About from "./About";
import Setting from "./Setting";

const Dashboard = ({uid}) => {

    const db = getFirestore();
    const [action, setAction] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclose();
    const [data,setData] = useState({data:[]});
    const [order, setOrder] = useState({orderBy:0});
    const [id, setId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const docRef = doc(db, uid, "data");
    const docRef2 = doc(db, uid, "config");

    useEffect(() => {
        getDoc(docRef)
        .then(d=>{
            if (d.data() !== undefined){
                AsyncStorage.getItem("temp").then((e)=>{
                    const decrypted = JSON.parse(decrypt(d.data(),e));
                    docRef2 && getDoc(docRef2).then(c=>{
                        const cf = c.data();
                        if(cf !== undefined && cf.order !== 0){
                            setOrder({orderBy:cf.order})
                            if(cf.order===1){
                                decrypted.sort((a,b)=>{
                                    if (a["Name"].toLowerCase() > b["Name"].toLowerCase()) {return 1};
                                    if (a["Name"].toLowerCase() < b["Name"].toLowerCase()) {return -1};
                                    return 0;
                                });
                            }else{
                                decrypted.sort((a,b)=>{ return a['type']-b['type'] });
                            }
                        }
                        setData({ data : decrypted });
                        setIsLoaded(true);
                    }).catch( ()=> {
                        setData({ data : decrypted });
                        setIsLoaded(true);
                    } );
                }).catch((error)=>console.log("--->ERROR<---"));
            }else{ setIsLoaded(true); }
        });
        return () => {}
    }, []);


    const elementos = (action) => {
        switch (action) {
            case 0:
                return <List data={data} setData={setData} uid={uid} handledAccion={handledAccion} />
            case 1:
                return <New data={data} setData={setData} uid={uid} />
            case 2:
                return <SeeEdit data={data} setData={setData} id={id} uid={uid} />
            case 3:
                return <Setting order={order.orderBy} uid={uid} data={data} setData={setData} />
            case 4:
                return <About />
            default:
                break;
        }
    }

    const titulo = (key) => {
        switch (key) {
            case 0:
                return "Home";
            case 1:
                return "New";
            case 2:
                return "Edit";
            case 3:
                return "Setting";
            case 4:
                return "About";
            default:
                break;
        }
    }

    const handledAccion = (value,id=undefined) => {
        onClose();
        setTimeout(()=>{
            id !== undefined && setId(id);
            setAction(value);
        },1);
    }

    const close = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            AsyncStorage.removeItem("temp").catch(()=>console.log("Error al borrar session"));
        }).catch((error) => {
            console.log("Error al cerrar sesion");
        });
    }

    const closeModal = () => {
        setModalVisible(false);
        close();
    }

    return(
        <View style={{flex:1}} w="100%" h="100%">
            <Box safeAreaTop bg="#6200ee" />
            <HStack bg="rgb(26, 28, 30)" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems="center">
                    <IconButton icon={<Icon size="sm" as={MaterialIcons} name="menu" color="blue.600" />} onPress={onOpen} />
                    <Text color="white" fontSize="20" fontWeight="bold" backgroundColor="red.100" ml={2}>
                        {titulo(action)}
                    </Text>
                </HStack>
                <HStack>
                    <IconButton icon={<Icon as={MaterialIcons} name="close" size="sm" backgroundColor="red.600" color="white" onPress={()=>setModalVisible(true)} />} />
                </HStack>
            </HStack>
            <Actionsheet isOpen={isOpen} onClose={onClose} >
                <Actionsheet.Content borderTopRadius="0" >
                    <Actionsheet.Item startIcon={<Icon as={MaterialIcons} color="trueGray.400" mr="1" size="6" name="home" />} onPress={()=>handledAccion(0)} >Home</Actionsheet.Item>
                    <Actionsheet.Item startIcon={<Icon as={MaterialIcons} color="trueGray.400" mr="1" size="6" name="post-add" />} onPress={()=>handledAccion(1)} >New</Actionsheet.Item>
                    <Actionsheet.Item startIcon={<Icon as={MaterialIcons} color="trueGray.400" mr="1" size="6" name="settings" />} onPress={()=>handledAccion(3)} >Setting</Actionsheet.Item>
                    <Actionsheet.Item startIcon={<Icon as={MaterialIcons} color="trueGray.400" mr="1" size="6" name="help-outline" />} onPress={()=>handledAccion(4)} >About</Actionsheet.Item>
                    <Actionsheet.Item startIcon={<Icon as={MaterialIcons} color="trueGray.400" mr="1" size="6" name="cancel" />} color="red" onPress={onClose} >Cancel</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
            <Skeleton.Text lines={10} px="4" isLoaded={isLoaded} mt={15}>
                { useMemo(()=>elementos(action),[action,data])  }
            </Skeleton.Text>

            <Modal isOpen={modalVisible} onClose={setModalVisible} size="lg">
                <Modal.Content maxH="212">
                    <Modal.CloseButton />
                    <Modal.Header>Close</Modal.Header>
                    <Modal.Body>
                        <ScrollView>
                            <Text>Are you sure you want to close the application?</Text>
                        </ScrollView>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button size="lg" variant="ghost" colorScheme="blueGray" onPress={() => {
                                setModalVisible(false);
                            }}>
                                Cancel
                            </Button>
                            <Button size="lg" onPress={closeModal}>Close</Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </View>
    );

}

export default Dashboard;