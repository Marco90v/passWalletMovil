import { Alert, Box, Button, Center, CheckIcon, FormControl, HStack, Icon, Input, ScrollView, Select, Stack, Text, VStack } from "native-base";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { encrypt } from "../functions/encrypt";
import { saveFirebase } from "../config/firebase";
import Animated, { FadeIn, FadeOut, Layout, SlideInLeft, SlideOutRight } from "react-native-reanimated";


const New =  ({data,setData, uid}) => {

    const [isLoading,setIsLoading] = useState(false);
    const [alert, setAlert] = useState({msg:"",type:""});
    const [input, setInput] = useState({type:0,Name:"",URL:"",User:"",Email:"",Password:""});
	const [estructura, setEstructura] = useState(["Name","URL","User","Email","Password"]);
	const [typePass, setTypePass] = useState(true);

    const changeElement = (type) => {
       switch (type) {
           case 0:
               setInput({type,Name:"",URL:"",User:"",Email:"",Password:""});
               setEstructura(["Name","URL","User","Email","Password"]);
               break;
            case 1:
                setInput({type,Name:"",URL:"",User:"",Email:"",Password:"",AccNum:"",CardNum:"",ExpDate:"",CVV:"",PasswordCard:""});
                setEstructura(["Name","URL","User","Email","Password","AccNum","CardNum","ExpDate","CVV","PasswordCard"]);
                break;
            case 2:
                setInput({type,Name:"",URL:"",User:"",Email:"",Password:"",Wallet:"",SecretPhr:""});
                setEstructura(["Name","URL","User","Email","Password","Wallet","SecretPhr"]);
                break;
            case 3:
                setInput({type,Name:"",Notes:""});
                setEstructura(["Name","Notes"]);
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
        const exist = data.data.find(e=>e.Name===input.Name)
        if (exist != undefined){
            setAlert({msg:"The name already exists, please enter another name.",type:"danger"})
            setIsLoading(false);
        }else{
            AsyncStorage.getItem("temp").then((e)=>{
                let datos = [];
                datos = data.data;
                datos.push(input);
                const enc = encrypt({data:datos},e);
                saveFirebase({data:datos},enc,setData,uid,setAlert,setIsLoading);
            });
        }
    }

    const getInputs = () => {
        return( 
            estructura.map((e,i)=>{
                return(
                    e!=="type" &&
                    <Stack key={i} name={i} style={{marginVertical:15}} >
                        <FormControl.Label>
                            <Text bold>{labelInputs(e)}</Text>
                        </FormControl.Label>
                        <Input 
                            key={i}
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

                        />
                    </Stack>
                );
            })
        );
    }


    return(
        <ScrollView w="100%" flex={1} h="89%" pb={2}>
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                <Center>
                    <Box w="90%" style={{marginVertical:15}} >
                        <FormControl.Label>
                            <Text bold>Type</Text>
                        </FormControl.Label>
                        <Select selectedValue={input.type} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="4" />
                            }} mt={1} onValueChange={ itemValue => changeElement(parseInt(itemValue)) }>
                            <Select.Item label="Web Site" value={0} />
                            <Select.Item label="Bank Account" value={1} />
                            <Select.Item label="Cryptocurrencies" value={2} />
                            <Select.Item label="Note" value={3} />
                        </Select>
                    </Box>
                </Center>
                {/* service:0  */}
                <Box alignItems="center" >
                    <Box w="90%" >
                        {getInputs()}
                    </Box>
                </Box>
                {/* Alert */}
                {
                    alert.msg!=="" &&
                        <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
                            <Center>
                                <Stack  w="90%">
                                    <Alert w="100%" status={alert.type} style={{marginBottom:15}}>
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
                    <Box w="90%" >
                        <Button size="lg"
                            onPress={save}
                            isLoading={isLoading}
                            spinnerPlacement="end"
                            isLoadingText="Connecting"
                            _loading={ { bg: "rgba(6, 182, 212, 0.5)", _text: { color: "coolGray.700" } } } _spinner={ { color: "white" } }
                        >Save</Button>
                    </Box>
                </Center>
            </Animated.View>
        </ScrollView>
    );

}

export default New;