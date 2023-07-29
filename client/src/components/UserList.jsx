import React, { useContext, useEffect, useState } from "react";
import server from "../apis/server";

import { UsersContext } from "../context/UsersContext";

const UserList = () => {
  const { users, setUsers } = useContext(UsersContext);
  const [edit, setEdit] = useState({ show: 0, id: null });
  const [add, setAdd] = useState(0);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await server.get("/admin/users");
        setUsers(response.data.data.users);
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const ans = window.confirm(
        "Deleting user will cause cascade deletion. Confirm?"
      );
      if (ans === true) {
        console.log("Deleting");
        await server.delete("/admin/users", {
          params: { id: id },
        });
        const new_resp = await server.get("/admin/users");
        setUsers(new_resp.data.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (id) => {
    try {
      const user = users.filter((user) => user.userid === id)[0];
      const params = { id: id, email: email, password: password };
      if (params.email === null) {
        params.email = user.email;
      }
      if (params.password === null) {
        params.password = user.password;
      }
      console.log(params.id, params.email, params.password);
      const response = await server.put("/admin/users", {
        id: params.id,
        email: params.email,
        password: params.password,
      });
      console.log(response.data);
      setEdit({ show: 0, id: null });
      const new_resp = await server.get("/admin/users");
      setUsers(new_resp.data.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  const Edit = async (id) => {
    try {
      if (edit.show === 1) {
        setEdit({ show: 0, id: null });
      } else {
        setEdit({ show: 1, id: id });
      }
    } catch (err) {}
  };

  const AddUser = async () => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (newEmail.match(validRegex) !== null && newPassword !== "") {
      try {
          await server.post("/admin/users", {
          email: newEmail,
          password: newPassword,
        });
        setAdd(add + 1);
        const new_resp = await server.get("/admin/users");
        setUsers(new_resp.data.data.users);
      } catch (err) {}
    }
  };

  const SearchFor = async (email) =>{
    //const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email !== "") {
      try {
        const req = await server.get("/admin/users", { params: { email: email }});
        setUsers(req.data.data.users);
      } catch (err) {}
    }
    else if(email === ""){
      try {
        const req = await server.get("/admin/users");
        setUsers(req.data.data.users);
      } catch (err) {}
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h1 className="">Users</h1>
        </div>
        <div className="col-4">
          <input
            type="email"
            className="form-control"
            placeholder="Look for a user"
            onChange={(e) =>SearchFor(e.target.value)}
          />
        </div>
        <div className="col-2">
          <button
            className=" btn btn-primary justify-content-end"
            onClick={() => setAdd(add + 1)}
          >
            Add a user
          </button>
        </div>
        {add % 2 === 1 && (
          <div className="row m-4 ml-3 p-4">
            <div className="col-5">
              <input
                type="email"
                className="form-control"
                placeholder="email"
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="col-5">
              <input
                className="form-control"
                placeholder="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="col-2">
              <button
                type="button"
                className="btn btn-primary btn-block justify-content-center"
                onClick={AddUser}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="row">
        <table class="table">
          <thead class="thead-dark">
            <tr className="bg-dark text-white">
              <td className="col-1">ID</td>
              <td className="col-4">Email</td>
              <td className="col-3">Password</td>
              <td className="col-2">Edit</td>
              <td className="col-2">Delete</td>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  <>
                    <tr key={user.userid}>
                      <td>{user.userid}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => Edit(user.userid)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDelete(user.userid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {edit.show === 1 && edit.id === user.userid && (
                      <tr>
                      <td></td>
                      <td>
                            <input
                              type="email"
                              className="form-control col-md-6"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              defaultValue={user.email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                      </td>
                      <td>
                            <input
                              className="form-control"
                              defaultValue={user.password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                      </td>
                      <td>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              onClick={() => handleSubmit(user.userid)}
                            >
                              Submit
                            </button>
                      </td>
                      </tr>
                    )}
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
