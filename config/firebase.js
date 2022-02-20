import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyDi8bEuFPPF8okv_WjdMEuAupUG836KHDs",
//   authDomain: "prueba-2f917.firebaseapp.com",
//   projectId: "prueba-2f917",
//   storageBucket: "prueba-2f917.appspot.com",
//   messagingSenderId: "1028798509980",
//   appId: "2:1028798509980:web:4c5a6b75617ad842b34e59"
// };

const firebaseConfig = {
	apiKey: "AIzaSyAqiHj0iaHv3a6fTkPFaTJeb_eAtAc_Auw",
	authDomain: "passwallet-d8c64.firebaseapp.com",
	projectId: "passwallet-d8c64",
	storageBucket: "passwallet-d8c64.appspot.com",
	messagingSenderId: "711833623616",
	appId: "1:711833623616:web:f27313a19cd9197c8113a5",
	measurementId: "G-9M47XVG7N8"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const validaSession = (setUid,setState) => {
	onAuthStateChanged(auth, (user) => {
		if(user){
			setUid(user.uid);
      		setState(2);
		}else{
			setState(1);
		}
	});
}

const iniciarSesion = (session,setMsgEmail,setMsgPass,setIsLoading) => {
	signInWithEmailAndPassword(auth, session.email, session.pass)
	.then( () => {
		AsyncStorage.setItem("temp", session.pass);
	})
	.catch((error) => {
		switch (error.code) {
			case "auth/wrong-password":
				setMsgPass('Wrong password');
				setIsLoading(false)
				break;
			case "auth/user-not-found":
				setMsgEmail('User not found');
				setIsLoading(false)
				break;
			default:
				setMsgPass(error.code);
				setMsgEmail(error.code);
				setIsLoading(false)
				break;
		}
	});
}

const crearCuenta = (session,setIsLoading) => {
	createUserWithEmailAndPassword(auth, session.email, session.pass1)
	.then( userCredential => console.log("Cuenta creada") )
	.catch((error) => {
		switch (error.code) {
			case "auth/email-already-in-use":
				setMsgEmail('Email is already in use.');
				setIsLoading(false)
				break;
			case "auth/invalid-email":
				setMsgEmail('Invalid e-mail.');
				setIsLoading(false)
				break;
			case "auth/weak-password":
				setMsgPass1('Weak password.');
				setMsgPass2('Weak password.');
				setIsLoading(false)
				break;
			default:
				setMsgPass(error.code);
				setMsgEmail(error.code);
				setIsLoading(false)
				break;
		}
	});
}

const saveFirebase = (data,encrypted,setData=undefined,uid,setAlert=undefined,setIsLoading=undefined,datos2=undefined,setPreLoadList=undefined) => {
	const db = getFirestore();
	const docRef = doc(db, uid, "data");
	setDoc(docRef, { 'data': encrypted.toString() }).then(()=>{
		setData !== undefined && setData({data:data.data});
		setPreLoadList !== undefined && setPreLoadList(datos2);
		setAlert!==undefined && setAlert({msg:"Aggregate Data.",type:"success"}); 
		setAlert!==undefined && setTimeout(()=>setAlert({msg:"",type:""}),3000);
		setIsLoading!==undefined && setIsLoading(false);
	}).catch(() => {
		setAlert!==undefined && setAlert({msg:"An error occurred while adding data.",type:"danger"}); 
		setAlert!==undefined && setTimeout(()=>setAlert({msg:"",type:""}),3000);
		setIsLoading!==undefined && setIsLoading(false);
	});
}

const saveConfig = (order,uid,setAlert=undefined,setIsLoading=undefined) => {
	const db = getFirestore();
	const docRef = doc(db, uid, "config");

	setDoc(docRef, { 'order':order })
	.then(()=> {
		setAlert!==undefined && setAlert(e=>{return {...e,alertSort:{msg:'Saved configuration.',type:'success'} } } );
		setAlert!==undefined && setTimeout(()=>setAlert(e=>{return {...e,alertSort:{msg:'',type:''} } } ),3000);
		setIsLoading!==undefined && setIsLoading(false);
	})
	.catch(()=> {
		setAlert!==undefined && setAlert(e=>{return {...e,alertSort:{msg:'Error saving configuration.',type:'error'} } } );
		setAlert!==undefined && setTimeout(()=>setAlert(e=>{return {...e,alertSort:{msg:'',type:''} } } ),3000);
		setIsLoading!==undefined && setIsLoading0(false);
	});
}
/* Cambio de contraseña */
const changeP = (newPass,data,encrypted,uid,setAlert,setIsLoading) => {
	const user = auth.currentUser;
	const db = getFirestore();
	const docRef = doc(db, uid, "data");
	updatePassword(user, newPass).then(() => {
		setDoc(docRef, { 'data': encrypted.toString() }).then(()=>{
			setAlert(e=>{return {...e,alertChangePass:{msg:"Password modified.",type:"success"} } } );
			setTimeout(()=>setAlert(e=>{return {...e,alertChangePass:{msg:"",type:""} } } ),3000);
			setIsLoading(false);
		}).catch(() => {
			setAlert(e=>{return {...e,alertChangePass:{msg:"An error occurred while adding data.",type:"error"} } } );
			setTimeout(()=>setAlert(e=>{return {...e,alertChangePass:{msg:"",type:""} } } ),3000);
			setIsLoading(false);
		});
	}).catch(() => {
		setAlert(e=>{return {...e,alertChangePass:{msg:'An error occurred when changing the password.',type:'error'} } } );
		setTimeout(()=>setAlert(e=>{return {...e,alertChangePass:{msg:"",type:""} } } ),3000);
		setIsLoading(false);
	});
}

const deleteD = (encrypted,uid,setData,setAlert,setIsLoading) => {
	const db = getFirestore();
	const docRef = doc(db, uid, "data");
	setDoc(docRef, { 'data': encrypted.toString() }).then(()=>{
		setData({data:[]});
		setAlert(e=>{return {...e,alertDeleteData:{msg:"Deleted data.",type:"success"} } } );
		setTimeout(()=>setAlert(e=>{return {...e,alertDeleteData:{msg:"",type:""} } } ),3000);
		setIsLoading(false);
	}).catch(() => {
		setAlert(e=>{return {...e,alertDeleteData:{msg:"Error when deleting data.",type:"error"} } } );
		setTimeout(()=>setAlert(e=>{return {...e,alertDeleteData:{msg:"",type:""} } } ),3000);
		setIsLoading(false);
	});
}

export {firebaseApp, saveFirebase, iniciarSesion, validaSession, crearCuenta, saveConfig, changeP, deleteD}
