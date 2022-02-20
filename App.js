import React, { useEffect, useState } from 'react';
import { Center, NativeBaseProvider, StatusBar } from "native-base";
import { validaSession } from "./config/firebase";
import * as NavigationBar from 'expo-navigation-bar';

import Loading from "./screen/Loading";
import LogingAccount from './screen/LogingAccount';
import CreateAccount from './screen/CreateAccount';
import Dashboard from './screen/Dashboard';
import Generate from './screen/Generate';
import { Platform } from 'react-native';


const App = () =>{
	const [LorC,setLorC] = useState(true);
	const [state,setState] = useState(0);
	const [uid,setUid] = useState(true);

	useEffect(() => {
		validaSession(setUid,setState);
		return () => {}
	}, [])
	

	if (Platform.OS === 'android') {
		NavigationBar.setBackgroundColorAsync("black");
	}

	const vistas =  () => {
		switch (state) {
			case 0:
				return <Loading />
			case 1:
				return LorC ? <LogingAccount setLorC={setLorC} /> : <CreateAccount setLorC={setLorC} />
			case 2:
				return <Dashboard uid={uid} />
			default:
				break;
		}
	}
	return(
		<NativeBaseProvider  >
			<StatusBar translucent={true} style={{backgroundColor:"#14ff00"}} />
			<Center style={{flex:1}} >
				{ vistas() }
			</Center>
			<Generate/>
		</NativeBaseProvider>
	);
}

export default App;