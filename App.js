// import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import { collection, getDocs } from "firebase/firestore";
import taxi from "./components/taxi-multitasking-at-work.png";
import logo from './components/logo-black.png';

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

import getFirebase from 'firebase/compat/app';
import useInput from './components/useInput';

import { useRef, useState, useEffect } from 'react';
import { getDatabase, ref, push } from "firebase/database";

// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Navbar from './components/Navbar';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';


//field is user, //string:value is message


//compatible with google and other email links
// const firebaseConfig = {
//   apiKey: "AIzaSyCOFxfdQuPYvCT91wGO16ASHy3PckcxlIE",
//   authDomain: "chata-253fe.firebaseapp.com",
//   projectId: "chata-253fe",
//   storageBucket: "chata-253fe.appspot.com",
//   messagingSenderId: "332614436903",
//   appId: "1:332614436903:web:6ac1dab78d26f03d562602",
//   measurementId: "G-HCRZWHLP3Y"
// };

// Use this to initialize the firebase App
// const firebaseApp = firebase.initializeApp(firebaseConfig);

firebase.initializeApp({
  apiKey: "AIzaSyCOFxfdQuPYvCT91wGO16ASHy3PckcxlIE",
  authDomain: "chata-253fe.firebaseapp.com",
  projectId: "chata-253fe",
  storageBucket: "chata-253fe.appspot.com",
  messagingSenderId: "332614436903",
  appId: "1:332614436903:web:6ac1dab78d26f03d562602",
  measurementId: "G-HCRZWHLP3Y"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const firestore = firebaseApp.firestore();

// use fiebase only for identification

function App() {

  // user auth hook when logged in 
  const [user] = useAuthState(auth);
  // const myUserDetails_name = auth.getCurrentUser().getDisplayName();
  // const myUserDetails_email = auth.getCurrentUser().getEmail();
  // const photoURL = auth.getInstance().getCurrentUser().getPhotoUrl()

  return (
    <div className="App">
      <div className="Navbar">
        <div className="logo-image">
          <img src={logo} height="60px" width="60px" class="img-fluid" />
        </div>
        <div className="align-Navbar">
          <SignOut />
        </div>
      </div>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
        <Tooltip title="Add Collection" className="AddCollection">
          <IconButton>
            <AddCircleIcon size="large" />
          </IconButton>
        </Tooltip>
      </section>
    </div>
  );
}


/// functions 


function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <div className="background" height="600px" width="600px" style={{ backgroundImage: `url(${taxi})` }}>
      <div className="button-alignment">
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>

      </div>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  // const todoRef = firestore.collection('test');
  const todoRef = firestore.collection(`users/${auth.currentUser.uid}/todos`);
  const [todo] = useCollectionData(todoRef, { idField: 'id' });
  // const [todo] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const [input, setInput] = useState('');



  const sendMessage = async (event) => {
    event.preventDefault();

    todoRef.add({
      text: formValue,
      complete: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setFormValue('');

  }

  return (
    <>
    <section className="grid">
      <main className="message-type">
        {/* <h1>To Do</h1> */}
        <h2>Collection Name</h2>
        <div className="list">
            {/* {querySnapshot && querySnapshot.map(msg => <ChatMessage key={msg.id} message={msg} />)} */}
            {todo && todo.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            {/* {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            <span ref={dummy}></span> */}
          </div>
          <form className="form" onSubmit={sendMessage}>
            {/* <Tooltip title="Add Item to List">
              <AddCircleOutlineIcon type="submit" size="70" disabled={!formValue}></AddCircleOutlineIcon>
            </Tooltip> */}
            <input type="text" value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="Add Items to List" />
        </form>
      </main>
    </section>
    </>
  )
}

function ChatMessage(props) {
  const { text } = props.message;

  // const todoRef = firestore.collection(`users/${auth.currentUser.uid}/todo`);
  // const onComplete = (id, complete) =>
  //   todoRef.doc(id).set({ complete: !complete }, { merge: true });

  // const onDelete = (id) => 
  //   console.log(todoRef.doc(id).get())

  //   todoRef.doc(id).delete()

  return (<>
    <div className="listitem">
      {/* <ListItem> */}
          <FormControlLabel control={<Checkbox 
          size="small" />} label={text}/>
          <IconButton className="trashcan" edge="end" aria-label="comments">
            <DeleteIcon />
          </IconButton>
      {/* </ListItem> */}
    </div>
  </>
  )
}



// if the use is defined show the chat room otherwise show the signin function


export default App;
