import { IconButton, TextField } from "@material-ui/core";

import React, { useEffect, useReducer } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";

import EditIcon from "@material-ui/icons/Edit";
import { TextFieldProps } from "@material-ui/core/TextField/TextField";
function useDataField(dataField, setDataField) {
  useEffect(() => {
    let newArr = dataField.map((item) => {
      return { ...item, originalValue: item.value || "", edit: false };
    });
    setDataField(newArr);
  }, []);
  function fields(state: any, action: any) {
    let newArr = dataField.map((item) => {
      console.log(dataField);
      if (action.name == item.name) {
        switch (action.type) {
          case "setValue":
            return { ...item, value: action.value };
          case "setEditTrue":
            return { ...item, edit: true };

          case "setEditFalse":
            return { ...item, edit: false };
          case "cancelEdit":
            return { ...item, edit: false, value: item.originalValue };
        }
      } else {
        return item;
      }
    });

    setDataField(newArr);
    return newArr;
  }

  return useReducer(fields, dataField);
}

export function SingleEditInput({
  attr,
  dataField,
  setDataField,
  updateAPI,
  ...custom
}: SingleEditInputType & TextFieldProps) {
  const [_, dispatch] = useDataField(dataField, setDataField);
  function EditSaveButton({ value, name, edit }) {
    const button = edit ? (
      <React.Fragment>
        <IconButton onClick={() => dispatch({ type: "cancelEdit", name })}>
          <CancelIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            updateAPI({ variables: { [name]: value } }).then(() =>
              dispatch({ type: "setEditFalse", name })
            );
          }}
        >
          <SaveIcon />
        </IconButton>
      </React.Fragment>
    ) : (
      <IconButton onClick={() => dispatch({ type: "setEditTrue", name })}>
        <EditIcon />
      </IconButton>
    );
    return button;
  }
  return (
    <TextField
      required
      value={attr.value}
      onChange={(e) => {
        dispatch({
          type: "setValue",
          name: attr.name,
          value: e.target.value,
        });
      }}
      {...custom}
      label={attr.label}
      type={attr.type}
      fullWidth
      disabled={!attr.edit}
      autoComplete={attr.type}
      rowsMax={attr.rowsMax}
      multiline={attr.multiline}
      InputProps={{
        endAdornment: EditSaveButton({
          value: attr.value,
          name: attr.name,
          edit: attr.edit,
        }),
      }}
    />
  );
}

interface SingleEditInputType {
  attr: any;
  dataField: Array<any>;
  setDataField: any;
  updateAPI: any;
}
