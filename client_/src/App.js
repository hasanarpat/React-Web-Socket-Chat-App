import React,{useEffect, useState} from "react";
import "./style.css";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  
  const [feedback,setFeedback]=useState(null);
  const [output, setOutput] = useState([]);
  const [message,setMessage]=useState(null);
  const [sender,setSender]=useState(null);

  
  function sendMessage(){
    socket.emit("chat", {
      message: message,
      sender: sender
    });
    
  }
  
  function eventListen(event){
    socket.emit("typing",sender);
    const mess=event.target.value;
    setMessage(mess);
  }

  function senderWho(event){
    const mailFrom=event.target.value;
    setSender(mailFrom);
  }

  useEffect(()=>{
    socket.on("chat", (data) => {
      setFeedback(null);
      const value=data;
      setOutput(prevValue=>{
        return [...prevValue,value];
      });
      
      
      setMessage(null);
    });
    socket.on("typing", (data) => {
      const Feedback =data+" is writing...";
      setFeedback(Feedback);
    });
  },[socket]);

  const children = output.map((val,index) => (
    <p key={index}>
    <strong>{val.sender}{ ": " }</strong>
    {val.message}
    </p>
  ));
  console.log(children);

  return (
    <div className="App">
      <div id="chat-wrap">
        <h2>Chat</h2>
        <div id="chat-window">
          <div id="output">
          {children}
          </div>
          <div id="feedback" ><p>{feedback}</p></div>
        </div>
        <input type="text" id="sender"  onChange={senderWho} placeholder="Name" />
        <input type="text" id="message"  onChange={eventListen} placeholder="Message" />
        <button id="submit" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
