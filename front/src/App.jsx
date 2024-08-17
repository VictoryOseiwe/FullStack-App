import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import swal from "sweetalert2";

//Creating my REACT APP
export default function App() {
  //Set a state for my formData's input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  //Set a state for my userData updates i.e form every input in the formData, it updates my userData
  const [users, setUsers] = useState(false);

  //Set a state for my currentUserId to manage the editing
  const [currentUserId, setCurrentUserId] = useState(null);

  //Set a state for my editing status i.e to show edit form or not
  const [editing, setEditing] = useState([]);

  //Handle form input changes and update formData state
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  //Handle form submission and send data to the server
  async function handleSubmit(e) {
    e.preventDefault();

    const response = await axios.post("http://localhost:3000/", formData);
    swal.fire({
      title: "NICE",
      text: `${formData.name} has been added successfully`,
      icon: "success",
    });
    // swal
    //   .fire({
    //     title: `Do you want to add ${formData.name}?`,
    //     showDenyButton: true,
    //     showCancelButton: true,
    //     confirmButtonText: "Save",
    //     denyButtonText: `Don't save`,
    //   })
    //   .then((result) => {
    //     /* Read more about isConfirmed, isDenied below */
    //     if (result.isConfirmed) {
    //       swal.fire(`${formData.name} has been added successfully`);
    //     } else if (result.isDenied) {
    //       swal.fire(`Couldn't add ${formData.name}`);
    //     }
    //   });
    setUsers(response.data);
    setFormData({
      name: "",
      email: "",
    });
  }

  //Fetch data from the server and update users state
  async function fetchUsers() {
    try {
      const response = await axios.get("http://localhost:3000/");
      console.log(response.data);

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  //Handle form data update and send data to the server
  async function handleDelete() {
    try {
      const response = await axios.delete("http://localhost:3000/");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  //Fetch data from the server on component mount for the site to wait for fetchData to complete
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>Welcome to the React App</h1>

        {/* form assignment */}
        <div className="formField">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
          <button className="submit" onClick={handleSubmit} type="submit">
            Submit
          </button>
          <button className="deleteAll" onClick={handleDelete} type="submit">
            Delete Everything
          </button>
        </div>

        <div className="users">
          <h2>Form Data:</h2>
          {/* To show list of users entered */}
          <p>
            {users.length > 0 ? (
              users.map((user) => (
                <li className="user" key={user.id}>
                  <h1>{user.name}</h1> - {user.email}
                  <button className="edit">Edit</button>
                  <button className="delete">Delete</button>
                </li>
              ))
            ) : (
              <li>No users found</li>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
