import React,{useState} from 'react'
import './styles.css'
import firebase from 'firebase/app';
import 'firebase/firestore'
import intializeDb from './db/firebase'




!firebase.apps.length?firebase.initializeApp(intializeDb):firebase.app()
var db = firebase.firestore();

function ChatIndex (){

const [name,setName] = useState(null);

const handler = ()=>{
    var person = prompt('what is your name');
    setName(person);
}
const clearHandler = ()=>{
  db.collection('messages').get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      db.collection('messages').doc(doc.id).delete()
      .then(()=>{
        console.log('Deleted message successfully')
      })
      .catch(()=>{
        console.log('Error Deleting message')
      })
    })
  })
  .catch(error=>{
    console.log(`Error getting elements : ${error}`)
  })
}

const submitHandler= (e)=>{
  e.preventDefault();
  let messageInput = document.getElementById('message-input');
  let message = messageInput.value;
  const collection = db.collection("messages")
  collection.add({
    name:name,
    message:message
  })
  .then(docRef=>{
    console.log('New Document added :',docRef.id)
    e.target.reset()
  })
  .catch((error)=>{
    console.log('error loading with message : ',error.message)
  })
    collection.onSnapshot(snapshot=>{
      let messageDiv = document.getElementById('messages')
      snapshot.forEach(doc=>{
        messageDiv.insertAdjacentHTML('afterbegin',
        `<div>
        <p className='name'>${doc.data().name}</p>
        <p>${doc.data().message}</p>
        </div>`)
        console.log('name:',doc.name,'and','message:',doc.message)
      })
    })

}
  return (
  <div>
	<div id="container">
		<div id="user-options">
			<div>Hi, <span id="name" >{name}</span></div>
			<div id="change-name" onClick ={handler}>change name</div>
		</div>

		<form id="message-form" onSubmit={submitHandler}>
			<input type="text" id="message-input" placeholder="message" required />
			<button className="orange-button">send</button>
      <button id='clear' className = 'purple-button' onClick={clearHandler} type='reset'>clear all messages</button>

		</form>

  <div id="messages"></div><br />
  </div>
  </div>
);
}

export default ChatIndex
