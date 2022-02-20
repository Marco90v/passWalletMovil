import { Alert, Box, Button, Center, CheckIcon, FormControl, HStack, Icon, Input, ScrollView, Select, Skeleton, Stack, Text, useClipboard, useToast, VStack } from "native-base";
import Animated, { FadeIn, FadeOut, Layout, SlideInLeft, SlideOutRight } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { encrypt } from "../functions/encrypt";
import { saveFirebase } from "../config/firebase";


const SeeEdit = ({data,setData,id,uid}) => {

    const datos = data.data.filter((e,i)=> {return e.Name===id && e})[0];

    const [alert, setAlert] = useState({msg:"",type:""});
    const [input, setInput] = useState({...datos});
	const [estructura, setEstructura] = useState([]);
	const [typePass, setTypePass] = useState(true);
    const [activate, setActivate] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const {onCopy} = useClipboard();
    const toast = useToast();

    useEffect(() => {
        switch (input.type) {
            case 0:
                setEstructura(["Name","URL","User","Email","Password"]);
               break;
            case 1:
                setEstructura(["Name","URL","User","Email","Password","AccNum","CardNum","ExpDate","CVV","PasswordCard"]);
                break;
            case 2:
                setEstructura(["Name","URL","User","Email","Password","Wallet","SecretPhr"]);
                break;
            case 3:
                setEstructura(["Name","Notes"]);
                break;
            default:
                break;
        }
    }, [input.type]);

    useEffect(() => {
        activate && setInput({...datos});
        return () => {}
    }, [activate])
    

    const changeElement = (type) => {
        switch (type) {
            case 0:
                setInput({ type, Name:datos.Name, URL:datos.URL, User:datos.User, Email:datos.Email, Password:datos.Password })
               break;
            case 1:
                setInput({ type, Name:datos.Name, URL:datos.URL, User:datos.User, Email:datos.Email, Password:datos.Password, AccNum:"", CardNum:"", ExpDate:"", CVV:"", PasswordCard:"" });
                break;
            case 2:
                setInput({ type, Name:datos.Name, URL:datos.URL, User:datos.User, Email:datos.Email, Password:datos.Password, Wallet:"", SecretPhr:"" });
                break;
            case 3:
                setInput({ type, Name:datos.Name, Notes:"" });
                break;
            default:
                break;
        }
    }
 
    const labelInputs = (e) => {
        switch (e) {
            case "AccNum":
                return "Account Number";
            case "CardNum":
                return "Card Number";
            case "ExpDate":
                return "Expiration Date";
            case "PasswordCard":
                return "Card Password";
            case "SecretPhr":
                return "Secret Phrase";
            default:
                return e;
        }
    }

    const save = () => {
        setIsLoading(true);
        AsyncStorage.getItem("temp").then((e)=>{
            const d = {data: data.data.map(x=>{ return x.Name===id ? input : x })};
            const enc = encrypt(d,e);
            saveFirebase(d,enc,setData,uid,setAlert,setIsLoading);
        });
    }

    const edit = () => {
        setActivate(e=>!e)
    }

    const getInputs = () => {
        return( 
            estructura.map((e,i)=>{
                return(
                    e!=="type" &&
                    <Stack key={i} name={i} style={{marginVertical:15}} >
                        <FormControl.Label><Text bold>{labelInputs(e)}</Text></FormControl.Label>
                        <Input
                            key={i}
                            isDisabled={e==="Name"?true:activate}
                            type="text"
                            secureTextEntry={e!=="Password" ? false : typePass}
                            placeholder={labelInputs(e)} 
                            name={e} 
                            value={input[e]} 
                            onChangeText={(ele)=>setInput({...input,[e]:ele})} 
                            InputRightElement={
                                e==="Password" &&
								<Icon
                                    key={i}
                                    as={typePass ? <MaterialIcons key={i} name="visibility" /> : <MaterialIcons key={i} name="visibility-off" />} 
                                    size={5} 
                                    mr="2" 
                                    color="muted.400" 
                                    onPress={()=>setTypePass(e=>{return !e})} 
                                />
							}
                            InputLeftElement={<Icon key={i*20} as={<FontAwesome5 key={i} name="copy" />} size={5} ml="2" color="muted.400"
                                onPress={()=> onCopy(input[e]).then(()=>toast.show({
                                    title: "Copied to the clipboard",
                                    status: "success"
                                })).catch(()=>toast.show({
                                    title: "Error when copying to clipboard",
                                    status: "error"
                                }))}
                            />}
                        />
                    </Stack>
                );
            })
        );
    }

    const SelectItems = () =>{
        const e = [
            {label:"Web Site", value:0},
            {label:"Bank Account", value:1},
            {label:"Cryptocurrencies", value:2},
            {label:"Note", value:3}
        ]
        return(
            e.map((e,i)=>{
                return( <Select.Item key={i} label={e.label} value={e.value} /> )
            })
        );
    }
    return(
        <ScrollView w="100%" flex={1}>
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                <Center>
                    <Box w="90%" style={{marginVertical:15}} >
                        <FormControl.Label>
                            <Text bold>Type</Text>
                        </FormControl.Label>
                        <Select selectedValue={input.type} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="4" />
                            }} 
                            mt={1} onValueChange={ itemValue => changeElement(parseInt(itemValue)) }
                        >
                            { !activate ? SelectItems() : <Select.Item label="----" value={-1} /> }
                        </Select>
                    </Box>
                </Center>
                {/* service:0  */}
                <Box alignItems="center" >
                    <Box w="90%" >
                        <Skeleton h={40} px="4" isLoaded={estructura.length===0?false:true} mt={15}>
                            {getInputs()}
                        </Skeleton>
                    </Box>
                </Box>
                {/* Alert */}
                {
                    alert.msg!=="" &&
                        <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
                            <Center>
                                <Stack  w="90%">
                                    <Alert w="100%" status={alert.type}>
                                    <VStack space={2} flexShrink={1} w="100%">
                                        <HStack flexShrink={1} space={2} justifyContent="space-between">
                                        <HStack space={2} flexShrink={1}>
                                            <Alert.Icon mt="1" />
                                            <Text fontSize="md" color="coolGray.800">
                                                {alert.msg}
                                            </Text>
                                        </HStack>
                                        </HStack>
                                    </VStack>
                                    </Alert>
                                </Stack>
                            </Center>
                        </Animated.View>

                }
                {/* Boton */}
                <Center style={{paddingBottom:15}}>
                    <Box w="90%" p="2" >
                        <Button size="lg" onPress={edit} style={ activate ? style.botonEdit : style.botonCancel } >
                            { activate ? "Edit" : "Cancel" }
                        </Button>
                    </Box>
                    <Box w="90%" p="2" >
                        <Button
                            isDisabled={activate}
                            isLoading={isLoading}
                            spinnerPlacement="end"
                            isLoadingText="Adding"
                            size="lg"
                            onPress={save}
                            _loading={ { bg: "rgba(6, 182, 212, 0.5)", _text: { color: "coolGray.700" } } } _spinner={ { color: "white" } }
                        >
                            Save
                        </Button>
                    </Box>
                </Center>
            </Animated.View>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    botonEdit:{
        backgroundColor:"rgb(255, 217, 10)"
    },
    botonCancel:{
        backgroundColor:"red"
    }
});

export default SeeEdit;