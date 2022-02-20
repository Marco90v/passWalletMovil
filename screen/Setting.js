import { Alert, Button, Center, CheckIcon, Divider, FormControl, HStack, Icon, Input, ScrollView, Select, Stack, Text, View, VStack } from "native-base";
import { useState } from "react";
import { StyleSheet } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveConfig, changeP, deleteD } from "../config/firebase";
import { encrypt } from "../functions/encrypt";
import Animated, { FadeIn, FadeOut, Layout, SlideInLeft, SlideOutRight } from "react-native-reanimated";

const MyAlert = (type,msg) => {
    return(
        <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
            <Center>
                <Stack  w="100%">
                    <Alert w="100%" status={type}>
                        <VStack space={2} flexShrink={1} w="100%">
                            <HStack flexShrink={1} space={2} justifyContent="space-between">
                                <HStack space={2} flexShrink={1}>
                                    <Alert.Icon mt="1" />
                                    <Text fontSize="md" color="coolGray.800">
                                        {msg}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </Alert>
                </Stack>
            </Center>
        </Animated.View>
    )
}

const Setting = ({order,uid,data,setData}) => {
    
    const [isLoading0,setIsLoading0] = useState(false);
    const [isLoading1,setIsLoading1] = useState(false);
    const [isLoading2,setIsLoading2] = useState(false);
	const [typePass, setTypePass] = useState(true);
	const [sortOrder, setSortOrder] = useState(order);
	const [changePass, setChangePass] = useState({oldPass:'',newPass1:'',newPass2:''});
	const [currentPass, setcurrentPass] = useState({pass:''});
	const [alert, setAlert] = useState({
        alertSort:{msg:'',type:''},
        alertChangePass:{msg:'',type:''},
        alertDeleteData:{msg:'',type:''},
    });

    const changeSort = () => { 
        setIsLoading0(true);
        saveConfig(sortOrder,uid,setAlert,setIsLoading0);
    }

    const changePassword = () => {
        setIsLoading1(true);
        AsyncStorage.getItem("temp").then((e)=>{
            if (changePass.oldPass === e) {
                if(changePass.newPass1===changePass.newPass2){
                    const enc = encrypt(data,changePass.newPass1);
                    changeP(changePass.newPass1,data,enc,uid,setAlert,setIsLoading1);
                    AsyncStorage.setItem("temp",changePass.newPass1);
                }else{
                    setAlert(e=>{ return{...e,alertChangePass:{msg:'New password does not match',type:'error'} } });
    			    setTimeout(()=>setAlert(e=>{return {...e,alertChangePass:{msg:"",type:""} } } ),3000);
                    setIsLoading1(false);
                }
            }else{
                setAlert(e=>{ return{...e,alertChangePass:{msg:'Old password does not match',type:'error'} } });
    			setTimeout(()=>setAlert(e=>{return {...e,alertChangePass:{msg:"",type:""} } } ),3000);
                setIsLoading1(false);
            }
        });
    }
    const deleteData = () => {
        setIsLoading2(true);
        AsyncStorage.getItem("temp").then((e)=>{
            if (currentPass.pass === e){
                const enc = encrypt({data:[]},currentPass.pass);
                deleteD(enc,uid,setData,setAlert,setIsLoading2);
            }else{
                setAlert(e=>{return {...e,alertDeleteData:{msg:"Password does not match.",type:"error"} } } );
        		setTimeout(()=>setAlert(e=>{return {...e,alertDeleteData:{msg:"",type:""} } } ),3000);
                setIsLoading2(false);
            }
        });
    }
    return(
        <ScrollView>
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                {/* Sort */}
                <Center>
                    <Stack w="90%" space={2} style={{marginTop:15}}>
                        <FormControl>
                            <FormControl.Label><Text bold>Sort (name, data type)</Text></FormControl.Label>
                            <Select selectedValue={sortOrder} minWidth="200" accessibilityLabel="Choose Service" placeholder="Choose Service" _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="4" />
                                }} mt={1} onValueChange={ itemValue => setSortOrder(parseInt(itemValue)) }>
                                <Select.Item label="---" value={0} />
                                <Select.Item label="Name" value={1} />
                                <Select.Item label="Data Type" value={2} />
                            </Select>
                        </FormControl>
                        { alert.alertSort.msg!=='' && MyAlert(alert.alertSort.type,alert.alertSort.msg) }
                        <Button
                            size="lg"
                            onPress={changeSort}
                            isLoading={isLoading0}
                            spinnerPlacement="end"
                            isLoadingText="Connecting"
                            _loading={ { bg: "rgba(6, 182, 212, 0.5)", _text: { color: "coolGray.700" } } } _spinner={ { color: "white" } }
                        >Save</Button>
                    </Stack>
                </Center>

                <Divider style={style.divider} />
                {/* ChangePass */}

                <Center>
                    <Stack w="90%" space={2}>
                        <FormControl>
                            <FormControl.Label><Text bold>Old Password</Text></FormControl.Label>
                            <Input 
                                type="text"
                                secureTextEntry={typePass}
                                placeholder="Old Password" 
                                name="oldPassword"
                                value={changePass.oldPass} 
                                onChangeText={(ele)=>setChangePass({...changePass,oldPass:ele})} 
                                InputRightElement={
                                    <Icon 
                                        as={typePass ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} 
                                        size={5} 
                                        mr="2" 
                                        color="muted.400" 
                                        onPress={()=>setTypePass(e=>{return !e})} 
                                    />
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label><Text bold>New Password</Text></FormControl.Label>
                            <Input 
                                type="text"
                                secureTextEntry={typePass}
                                placeholder="New Password" 
                                name="newPassword"
                                value={changePass.newPass1} 
                                onChangeText={(ele)=>setChangePass({...changePass,newPass1:ele})} 
                                InputRightElement={
                                    <Icon 
                                        as={typePass ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} 
                                        size={5} 
                                        mr="2" 
                                        color="muted.400" 
                                        onPress={()=>setTypePass(e=>{return !e})} 
                                    />
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label><Text bold>Repeat New Password</Text></FormControl.Label>
                            <Input 
                                type="text"
                                secureTextEntry={typePass}
                                placeholder="Repeat New Password" 
                                name="repeatNewPassword"
                                value={changePass.newPass2} 
                                onChangeText={(ele)=>setChangePass({...changePass,newPass2:ele})} 
                                InputRightElement={
                                    <Icon 
                                        as={typePass ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} 
                                        size={5} 
                                        mr="2" 
                                        color="muted.400" 
                                        onPress={()=>setTypePass(e=>{return !e})} 
                                    />
                                }
                            />
                        </FormControl>
                        { alert.alertChangePass.msg!=='' && MyAlert(alert.alertChangePass.type,alert.alertChangePass.msg) }
                        <Button
                            size="lg"
                            onPress={changePassword}
                            isLoading={isLoading1}
                            spinnerPlacement="end"
                            isLoadingText="Connecting"
                            _loading={ { bg: "rgba(6, 182, 212, 0.5)", _text: { color: "coolGray.700" } } } _spinner={ { color: "white" } }
                        >Save</Button>
                    </Stack>
                </Center>

                <Divider style={style.divider} />
                {/* deleteData */}

                <Center>
                    <Stack w="90%" space={2} >
                        <FormControl>
                            <FormControl.Label><Text bold>Current Password</Text></FormControl.Label>
                            <Input 
                                type="text"
                                secureTextEntry={typePass}
                                placeholder="Current Password" 
                                name="repeatNewPassword"
                                value={currentPass.pass} 
                                onChangeText={(ele)=>setcurrentPass({...currentPass,pass:ele})} 
                                InputRightElement={
                                    <Icon 
                                        as={typePass ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} 
                                        size={5} 
                                        mr="2" 
                                        color="muted.400" 
                                        onPress={()=>setTypePass(e=>{return !e})} 
                                    />
                                }
                            />
                        </FormControl>
                        { alert.alertDeleteData.msg!=='' && MyAlert(alert.alertDeleteData.type,alert.alertDeleteData.msg) }
                        <Button
                            size="lg"
                            onPress={deleteData}
                            isLoading={isLoading2}
                            spinnerPlacement="end"
                            isLoadingText="Connecting"
                            _loading={ { bg: "rgba(6, 182, 212, 0.5)", _text: { color: "coolGray.700" } } } _spinner={ { color: "white" } }
                        >Save</Button>
                    </Stack>
                </Center>
            </Animated.View>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    divider:{
        marginVertical:"5%"
    }
});

export default Setting