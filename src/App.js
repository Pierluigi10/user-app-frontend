/* eslint-disable react-hooks/exhaustive-deps */
import "./App.scss";
import { useState, useEffect } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";

function App() {
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formName, setFormName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");

  // const backendUrl = "http://localhost:3022";
  // const backendUrl = "https://manage-user-app-backend.herokuapp.com/";
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const loadUsers = async () => {
    const response = await fetch(backendUrl);
    const users = await response.json();
    users.forEach((user) => (user.isEditingEmail = false));
    // console.log("2", users);
    setUsers(users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteButton = async (user) => {
    await fetch(`${backendUrl}/deleteuser/${user._id}`, { method: "DELETE" });
    loadUsers();
  };

  const handleEditButton = (user) => {
    user.isEditingEmail = !user.isEditingEmail;
    setUsers([...users]);
  };

  const handleEmailChange = (user, e) => {
    user.email = e.target.value;
    setUsers([...users]);
  };

  const handleEmailSave = async (user) => {
    await fetch(`${backendUrl}/edituser/${user._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
      }),
    });
    loadUsers();
  };

  const handleEditCancelButton = (user) => {
    // user.isEditingEmail = !user.isEditingEmail;
    loadUsers();
  };

  const clearForm = () => {
    setFormName("");
    setFormUsername("");
    setFormEmail("");
  };

  const handleToggleAddUserArea = () => {
    setIsAddingUser(!isAddingUser);
  };

  const handleCancelAddForm = (e) => {
    e.preventDefault();
    clearForm();
    setIsAddingUser(!isAddingUser);
  };

  const handleFormName = (e) => {
    setFormName(e.target.value);
  };

  const handleFormUsername = (e) => {
    setFormUsername(e.target.value);
  };

  const handleFormEmail = (e) => {
    setFormEmail(e.target.value);
  };

  const handleFormSaveButton = (e) => {
    e.preventDefault();
    (async () => {
      await fetch(`${backendUrl}/adduser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            name: formName,
            username: formUsername,
            email: formEmail,
          },
        }),
      });
      clearForm();
      setIsAddingUser(false);
      loadUsers();
    })();
  };
  return (
    <div className="App">
      <h1>User Management APP</h1>
      {/* <div>[{process.env.REACT_APP_BACKEND_URL}]</div> */}
      <div className="addUserArea">
        <div className="topInfoRow">
          <button onClick={handleToggleAddUserArea}>Add User</button>
          <div className="totalInfo">Total: {users.length} users</div>
        </div>
        {isAddingUser && (
          <div className="addUserFormArea">
            <form>
              <div className="row">
                <label htmlFor="name">Full Name: </label>
                <input
                  type="text"
                  value={formName}
                  onChange={handleFormName}
                  id="name"
                />
              </div>

              <div className="row">
                <label htmlFor="username">User Name: </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={handleFormUsername}
                  id="username"
                />
              </div>

              <div className="row">
                <label htmlFor="email">Email: </label>
                <input
                  type="text"
                  value={formEmail}
                  onChange={handleFormEmail}
                  id="email"
                />
              </div>

              <div className="formButtonArea">
                <button onClick={(e) => handleFormSaveButton(e)}>
                  Save New User
                </button>
                <button onClick={handleCancelAddForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <section className="users">
        {users.map((user, index) => {
          return (
            <div key={index} className="userCard">
              <div className="row">
                <div className="label">Full Name:</div>
                <div className="data">{user.name}</div>
              </div>
              <div className="row">
                <div className="label">User Name:</div>
                <div className="data">{user.username}</div>
              </div>
              <div className="row">
                <div className="label">E-Mail:</div>
                {!user.isEditingEmail ? (
                  <div className="data">{user.email}</div>
                ) : (
                  <div className="data editing">
                    <input
                      type="text"
                      onChange={(e) => handleEmailChange(user, e)}
                      value={user.email}
                    />
                    <button onClick={() => handleEmailSave(user)}>Save</button>
                    <button onClick={() => handleEditCancelButton(user)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="iconRow">
                <button
                  onClick={() => handleDeleteButton(user)}
                  className="icon"
                >
                  <RiDeleteBin6Line />
                </button>
                <button className="icon" onClick={() => handleEditButton(user)}>
                  <GrEdit />
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
