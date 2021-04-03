import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Cookies from "universal-cookie";
const publicSocket = io("ws://localhost:5000/public", {
  autoConnect: true,
});
const cookies = new Cookies();

var socket = io("http://localhost:5000", {
  auth: { username: cookies.get("graph_token") },
});

function InsiderHouse() {
  const [username, setUsername] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (username) {
      setShowAlert(false);
    }
  }, [username]);
  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      setShowAlert(true);
    }
  });

  socket.on("error", (err) => {
    console.log(err);
  });

  socket.on("joined", (msg) => {
    console.log(msg);
  });

  const handleUsername = () => {
    // socket.emit("chat message", username);
    //@ts-ignore
    socket.auth = { username };
    socket.connect();
  };

  const handleChat = () => {
    // socket.emit("chat message", username);
    if (socket.connected) socket.emit("join", { id: null, name: "GAME" });
    else alert("insert username");
  };

  socket.on("private message", ({ content }) => {
    console.log(content);
  });

  // socket.on("users", function (msg) {
  //   console.log(msg);
  //   setUserList(msg);
  // });

  // socket.on("user connected", (user) => {
  //   console.log(user);
  //   setUserList([...userList, user]);
  // });
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

      <Button onClick={handleChat}>JOIN ROOM</Button>
      <AlertBox show={showAlert}></AlertBox>
      <RoomList></RoomList>
    </React.Fragment>
  );
}

function RoomList() {
  const [roomList, setRoomList] = useState([]);
  const router = useRouter();
  publicSocket.on("room_list", function (res) {
    setRoomList(res);
  });

  const handleJoinRoom = (id) => {
    if (socket.connected) {
      router.push("/insiderhouse/[id]", `/insiderhouse/${id}`);
    } else alert("insert Username");
  };
  return (
    <React.Fragment>
      <div>
        Room List
        {roomList &&
          roomList.map((el) => (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {el.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleJoinRoom(el._id)}>
                  Join
                </Button>
              </CardActions>
            </Card>
          ))}
      </div>
    </React.Fragment>
  );
}

function AlertBox({ show }) {
  return (
    <React.Fragment>
      {show && (
        <Alert severity="error" color="info">
          Please Insert Username
        </Alert>
      )}
    </React.Fragment>
  );
}

export default InsiderHouse;
