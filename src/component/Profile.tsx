import { Typography, TextField, Button } from "@material-ui/core";
import { useEffect, useState } from "react";

import { useContextDispatch } from "../context";
export default function Profile() {
  const [profile, setProfile] = useState({ phoneNumber: "", displayName: "" });
  const dispatch = useContextDispatch();
  useEffect(() => {
 
  }, []);

  function handleSave() {
    
  }

  return (
    <div>
      <Typography>User Profile</Typography>
      <TextField
        label="Phone No"
        style={{ margin: 8 }}
        placeholder="Phone No"
        helperText=""
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) =>
          setProfile({ ...profile, phoneNumber: e.target.value })
        }
        value={profile.phoneNumber}
      />
      <TextField
        label="Display Name"
        style={{ margin: 8 }}
        placeholder="Display Name"
        helperText=""
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        value={profile.displayName}
        onChange={(e) =>
          setProfile({ ...profile, displayName: e.target.value })
        }
      />
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}
