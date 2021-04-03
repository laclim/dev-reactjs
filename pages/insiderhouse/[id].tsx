import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { Box, Button, Divider, Paper, TextField } from "@material-ui/core";
import Cookies from "universal-cookie";
const cookies = new Cookies();
var socket = io("http://localhost:5000", {
  auth: { username: cookies.get("graph_token") },
});
function chatRoom() {
  const router = useRouter();
  const [chatMsg, setChatMsg] = useState("");
  const { id } = router.query;
  useEffect(() => {
    socket.emit("join", { id });

    socket.on("message", (res) => {
      console.log(res);
    });
  }, []);

  const handleSendMessage = () => {
    if (chatMsg) {
      socket.emit("message", { message: chatMsg });
      setChatMsg("");
    }
  };

  return (
    <React.Fragment>
      <Box height={400}>
        <Box m={2} p={2}>
          test
        </Box>
        <Divider></Divider>
      </Box>
      <Box display="flex">
        <TextField
          rowsMax={3}
          multiline
          fullWidth
          variant="outlined"
          value={chatMsg}
          onChange={(e) => {
            setChatMsg(e.target.value);
          }}
        ></TextField>
        <Button onClick={() => handleSendMessage()}>send</Button>
      </Box>
    </React.Fragment>
  );
}

export default chatRoom;
