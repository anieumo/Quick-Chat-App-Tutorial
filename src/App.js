import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

import getFirebase from 'firebase/compat/app';
import useInput from './components/useInput';

import { useRef, useState, useEffect } from 'react';

// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Navbar from './components/Navbar';

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

function App() {

  // user auth hook when logged in 
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <div className="Navbar">
        <div className="align-Navbar">
          <SignOut />
        </div>
      </div>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
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
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messageRef = firestore.collection("test");
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (event) => {
    event.preventDefault();

    await messageRef.add({
      text: formValue,
      creataedAt: firebase.firestore.FieldValue.serverTimestamp(),
      // uid
    })

    setFormValue('');
    // dummmy.current.scrollIntoView({ behavior: smooth })

    console.log(messages)
  }

  return (
    <>
    <main className="message-type">
      <h1>Start chatting!</h1>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </div>
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(event) => setFormValue(event.target.value)} placeholder="say something nice" />
      <button type="submit" disabled={!formValue}>Send</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';


  return (<>
    <div className={`message ${messageClass}`}>

      <p>{text}</p>
    </div>
  </>
  )
}



// if the use is defined show the chat room otherwise show the signin function


export default App;
