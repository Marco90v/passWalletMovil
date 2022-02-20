import { Button, FormControl, Icon, Image, Input, Stack, WarningOutlineIcon } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from "react";
import { crearCuenta } from "../config/firebase";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import logoIni from "../assets/lock.png";

const CreateAccount = ({setLorC}) => {

	const [isLoading,setIsLoading] = useState(false);
    const [session, setSession] = useState({email:'',pass1:'',pass2:''});
    const [typePass, setTypePass] = useState(true);
    const [msgEmail, setMsgEmail] = useState("");
    const [msgPass1, setMsgPass1] = useState("");
    const [msgPass2, setMsgPass2] = useState("");

    const validar = () =>{
        setIsLoading(true);
        setMsgEmail("");
        setMsgPass1("");
        setMsgPass2("");
        if(session.email===""){ setMsgEmail("Debe Ingresar Email"); setIsLoading(false) }
        if(session.pass1===""){ setMsgPass1("Debe Ingresar Pasword"); setIsLoading(false) }
        if(session.pass2===""){ setMsgPass2("Debe Ingresar Pasword"); setIsLoading(false) }
        if(session.pass1!=="" && session.pass2!==""){
            if(session.pass1!==session.pass2){
                setMsgPass1("Password no coincide");
                setMsgPass2("Password no coincide");
                setIsLoading(false);
            }else{
                crearCuenta(session,setIsLoading)
            }
        }
    }  


    return(
        <Animated.View style={{width:"100%"}} entering={FadeIn} exiting={FadeOut}>
            <Stack space={4} w="100%" alignItems="center">
				<Image source={logoIni} alt="PassWalletMovil" size="xl" />
                <FormControl isInvalid={msgEmail!==""} w="90%" >
                    <Input 
                        // w={{ base: "75%", md: "25%" }}
                        InputLeftElement={
                            <Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />
                        } 
                        placeholder="Email" 
                        keyboardType="email-address"
                        value={session.email}
                        onChangeText={(e)=>setSession({...session,email:e})}
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        {msgEmail}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={msgPass1!==""} w="90%" >
                    <Input 
                        // w={{ base: "75%", md: "25%" }}
                        InputRightElement={
                            <Icon as={typePass ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} size={5} mr="2" color="muted.400" onPress={()=>setTypePass(e=>{return !e})} />
                        }
                        placeholder="Password"
                        secureTextEntry={typePass}
                        value={session.pass}
                        onChangeText={(e)=>setSession({...session,pass1:e})}
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        {msgPass1}
                    </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={msgPass2!==""} w="90%" >
                    <Input 
                        // w={{ base: "75%", md: "25%" }}
                        InputRightElement={
                            <Icon as={typePass ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} size={5} mr="2" color="muted.400" onPress={()=>setTypePass(e=>{return !e})} />
                        }
                        placeholder="Password"
                        secureTextEntry={typePass}
                        value={session.pass}
                        onChangeText={(e)=>setSession({...session,pass2:e})}
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        {msgPass2}
                    </FormControl.ErrorMessage>
                </FormControl>
                <Button size="lg"
                    onPress={() => validar()}
                    isLoading={isLoading}
					spinnerPlacement="end"
					isLoadingText="Connecting"
					_loading={ { bg: "rgba(6, 182, 212, 0.5)", _text: { color: "coolGray.700" } } } _spinner={ { color: "white" } }
                >Sing Up</Button>
                <Button size="lg" variant="link" onPress={()=>setLorC(e=>{return !e})}>Create an Account</Button>
            </Stack>

        </Animated.View>
    );

}

export default CreateAccount;