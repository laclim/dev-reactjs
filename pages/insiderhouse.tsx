import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
var socket = io("http://localhost:5000", { autoConnect: false });

socket.on("connect_error", (err) => {
  if (err.message === "invalid username") {
    console.log("invalid");
  }
});

function InsiderHouse() {
  const [username, setUsername] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [userList, setUserList] = useState([]);

  const handleUsername = () => {
    // socket.emit("chat message", username);
    //@ts-ignore
    socket.auth = { username };
    socket.connect();
  };

  const handleChat = () => {
    // socket.emit("chat message", username);
    socket.emit("private message", {
      content: chatMsg,
    });
  };

  socket.on("private message", ({ content }) => {
    console.log(content);
  });

  socket.on("users", function (msg) {
    console.log(msg);
    setUserList(msg);
  });

  socket.on("user connected", (user) => {
    console.log(user);
    setUserList([...userList, user]);
  });
  return (
    <React.Fragment>
      <TextField
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      ></TextField>
      <Button onClick={handleUsername}>GO</Button>
      <div>
        {userList && userList.map((el, i) => <p key={i}>{el.username}</p>)}
      </div>

      <TextField
        value={chatMsg}
        onChange={(e) => {
          setChatMsg(e.target.value);
        }}
      ></TextField>
      <Button onClick={handleChat}>GO</Button>
    </React.Fragment>
  );
}

export default InsiderHouse;
