import { Button, FormControl, Icon, Image, Input, Stack, Text, WarningOutlineIcon } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from "react";
import { iniciarSesion } from "../config/firebase";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import logoIni from "../assets/lock.png";

const LogingAccount = ({setLorC}) => {
    
	const [isLoading,setIsLoading] = useState(false);
	const [session, setSession] = useState({email:'',pass:''});
	const [typePass, setTypePass] = useState(true);
	const [msgEmail, setMsgEmail] = useState("");
	const [msgPass, setMsgPass] = useState("");

	const validar = () =>{
		setIsLoading(true);
		setMsgEmail("");
		setMsgPass("");
		if(session.email===""){
			setMsgEmail("Debe Ingresar Email");
			setIsLoading(false)
		}
		if(session.pass===""){
			setMsgPass("Debe Ingresar Pasword");
			setIsLoading(false)
		}
		if(session.email!=="" && session.pass!==""){
			iniciarSesion(session,setMsgEmail,setMsgPass,setIsLoading);
		}
	}

	return(
		<Animated.View style={{width:"100%"}} entering={FadeIn} exiting={FadeOut} >
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
				<FormControl isInvalid={msgPass!==""} w="90%" >
					<Input 
						// w={{ base: "75%", md: "25%" }}
						InputRightElement={
							<Icon as={typePass ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />} size={5} mr="2" color="muted.400" onPress={()=>setTypePass(e=>{return !e})} />
						}
						placeholder="Password"
						secureTextEntry={typePass}
						value={session.pass}
						onChangeText={(e)=>setSession({...session,pass:e})}
					/>
					<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
						{msgPass}
					</FormControl.ErrorMessage>
				</FormControl>
				<Button size="lg"
					onPress={() => validar()}
					isLoading={isLoading}
					spinnerPlacement="end"
					isLoadingText="Connecting"
					_loading={ { bg: "rgba(6, 182, 212, 0.5)", _text: { color: "coolGray.700" } } } _spinner={ { color: "white" } }
				>Sing In</Button>
				<Button size="lg" variant="link" onPress={()=>setLorC(e=>{return !e})}>Create an Account</Button>
			</Stack>
		</Animated.View>
	);
}


export default LogingAccount;