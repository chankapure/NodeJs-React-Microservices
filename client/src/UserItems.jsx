import React, { useState } from "react";
import ReactDOM from "react-dom";
import CheckIcon from "@material-ui/icons/Check";

import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";

import EditIcon from "@material-ui/icons/Edit";
import Box from "@material-ui/core/Box";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const UserItems = (props) => {
  const { setShowForm, fillForm, addedItem } = props;

  const onEdit = () => {
    setShowForm(true);
    fillForm(addedItem);
  };

  return (
    <TableRow>
      <TableCell>{addedItem.id}</TableCell>
      <TableCell>{addedItem.name}</TableCell>
      <TableCell>{addedItem.email}</TableCell>
      <TableCell>{addedItem.gender}</TableCell>
      <TableCell
        style={{ color: addedItem.status == "active" ? "green" : "red" }}
      >
        {addedItem.status}
      </TableCell>
      <TableCell>
        <Box display="flex" p={1}>
          <Box p={1}>
            <Fab
              color="primary"
              aria-label="edit"
              onClick={onEdit}
              style={{ marginLeft: "5px" }}
            >
              <EditIcon />
            </Fab>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};
export default UserItems;
