import React, { useEffect, useState } from "react";
import axios from "axios";

//Creating my REACT APP
export default function App() {
  //Set a state for my formData's input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  //Set a state for my userData updates i.e form every input in the formData, it updates my userData
  const [users, setUsers] = useState([]);

  //Handle form input changes and update formData state
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  //Handle form submission and send data to the server
  async function handleSubmit(e) {
    e.preventDefault();

    const response = await axios.post("http://localhost:3000/", formData);
    alert("Form submitted successfully!");
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
    <div>
      <h1>Welcome to the React App</h1>

      {/* form assignment */}
      <div>
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
        <button onClick={handleSubmit} type="submit">
          Submit
        </button>
        <button onClick={handleDelete} type="submit">
          Delete Everything
        </button>
      </div>

      <div>
        <h2>Form Data:</h2>
        {/* To show list of users entered */}
        <p>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))
          ) : (
            <li>No users found</li>
          )}
        </p>
      </div>
    </div>
  );
}
