import React, { useEffect, useState } from "react";
import axios from "axios";
import UserRow from "./UserItems";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const UserApp = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [gender, setGender] = useState(null);
  const [status, setStatus] = useState(null);
  const [id, setId] = useState(null);
  const [updateList, setUpdateList] = useState(false);
  const [message, setMessage] = useState(false);
  const [messageColor, setMessageColor] = useState("red");

  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemAdded, displayItem] = useState([]);

  const onChangeName = (event) => {
    setName(event.target.value);
  };
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onChangeGender = (event) => {
    setGender(event.target.value);
  };
  const onChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const fillForm = (data) => {
    setName(data.name);
    setId(data.id);
    setEmail(data.email);
    setGender(data.gender);
    setStatus(data.status);

    window.scrollTo(0, 0);
  };

  const getUsersList = async () => {
    try {
      setIsLoading(true);
      const getDataRef = await axios.get(process.env.REACT_APP_USERS_LIST);
      displayItem(getDataRef.data.data);
      setIsLoading(false);
    } catch (error) {
      setMessageColor("red");
      setMessage(error.message);
    }
  };

  const updateRecord = async () => {
    try {
      const updateRow = await axios.put(
        `${process.env.REACT_APP_USER_UPDATE}/${id}`,
        {
          name,
          email,
          gender,
          status,
        }
      );

      if (updateRow) {
        setShowForm(false);
        setMessageColor("green");
        setMessage(`Record (${id}) updated successfully`);

        setName("");
        setId("");
        setEmail("");
        setGender("");
        setStatus("");
        setUpdateList(true);
      } else {
        setMessageColor("red");
        setMessage("Failed to update the record: " + id);
      }
    } catch (error) {
      setMessageColor("red");
      setMessage(error.message);
    }
  };

  useEffect(() => {
    getUsersList();
  }, []);

  useEffect(() => {
    updateList && getUsersList();
  }, [updateList]);

  return (
    <>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          paddingTop: "1px",
          minHeight: "100vh",
          margin: "0px",
        }}
      >
        <h1
          style={{
            backgroundColor: "#7e57c2",
            color: "white",
            fontSize: "30px",
            textAlign: "left",
            padding: "20px",
            fontFamily: "sans-serif",
          }}
        >
          My Users
        </h1>
        <br />
        {showForm && (
          <Box display="flex" justifyContent="left">
            <TextField
              id="standard-basic1"
              label="Name"
              onChange={onChangeName}
              value={name}
            />
            &nbsp;&nbsp;
            <TextField
              id="standard-basic2"
              label="Email"
              onChange={onChangeEmail}
              value={email}
            />
            &nbsp;&nbsp;
            <TextField
              id="standard-basic3"
              label="Gender"
              onChange={onChangeGender}
              value={gender}
            />
            &nbsp;&nbsp;
            <TextField
              id="standard-basic4"
              label="Status"
              onChange={onChangeStatus}
              value={status}
            />
            &nbsp;&nbsp;
            <button
              style={{ backgroundColor: "#7e57c2", color: "white" }}
              // aria-label="add"
              onClick={updateRecord}
            >
              {/* <NoteAddIcon /> */}
              UPDATE
            </button>
          </Box>
        )}
        <Box display="flex" justifyContent="center">
          <h3 style={{ color: messageColor }}>{message}</h3>
        </Box>
        <br />
        {isLoading && (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              text-align="center"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow colSpan="6" align="center">
                  <TableCell>
                    <h2>Loading please wait...</h2>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!isLoading && (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              text-align="center"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    Action&nbsp;{" "}
                    <a
                      href={process.env.REACT_APP_USER_EXPORT}
                      target="_blank"
                      style={{
                        backgroundColor: "grey",
                        color: "white",
                        padding: "5px",
                        borderRadius: "10px",
                        textDecoration: "none",
                      }}
                    >
                      CSV DOWNLOAD
                    </a>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemAdded.map((itemval, index) => {
                  return (
                    <UserRow
                      key={index}
                      id={index}
                      fillForm={fillForm}
                      addedItem={itemval}
                      showForm={showForm}
                      setShowForm={setShowForm}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </>
  );
};
export default UserApp;
