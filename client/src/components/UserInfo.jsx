import React, { useState, useEffect, useContext } from "react";
import server from "../apis/server";
import { UsersContext } from "../context/UsersContext";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

// Set Cookies
// Fetche data into users
const UserInfo = (props) => {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordconfirm, setNewPasswordconfirm] = useState("");

  const [edit, setEdit] = useState(false);

  const history = useHistory();
  const userid = Cookies.get("userid");
  const { users, setUsers } = useContext(UsersContext);
  useEffect(() => {
    // Define function, sent api calls
    const fetchdata = async () => {
      try {
        const response1 = await server.get(`/admin/users/${userid}`);
        setUsers(response1.data.data.users);
      } catch (err) {
        console.log("error");
      }
    };
    fetchdata();
  }, []);

  const handleEdit = (userid) => {
    setEdit(!edit);
  };

  const handleUpdate = async () => {
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      newEmail.match(validRegex) !== null &&
      newPassword !== "" &&
      newPassword === newPasswordconfirm
    ) {
      try {
        await server.put(`/admin/users/${userid}`, {
          email: newEmail,
          password: newPassword,
        });
        setEdit(!edit);
        alert("Successfully Updated!");
      } catch (err) {}
    } else {
      alert("Wrong email format/password does not match! Update Failed!");
      handleEdit();
    }
  };

  return (
    <div>
      {users &&
        users.map((item) => {
          return (
            <div key={users.email + 1}>
              <div className="col-md">
                <div className="form-floating">
                  <plaintext
                    type="email"
                    readOnly
                    className="form-control"
                    id="floatingInputGrid"
                    placeholder="userid"
                  >
                    {item.userid}
                  </plaintext>

                  <label htmlFor="floatingInputGrid">User ID</label>
                </div>
              </div>

              {!edit && (
                <>
                  <div className="col-md">
                    <div className="form-floating">
                      <input
                        type="email"
                        readOnly
                        className="form-control"
                        id="floatingInputGrid"
                        placeholder="name@example.com"
                        value={item.email}
                      />
                      <label htmlFor="floatingInputGrid">Email address</label>
                    </div>
                  </div>
                  <div className="col-md">
                    <div className="form-floating">
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="btn btn-outline-success"
                        id="floatingInputGrid"
                      >
                        Edit{" "}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {edit && (
                <>
                  <div className="col-md">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="floatingInputGrid"
                        placeholder="name@example.com"
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      <label htmlFor="floatingInputGrid">Email address</label>
                    </div>
                  </div>
                  <div className="col-md">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="floatingInputGrid"
                        placeholder="new password"
                        onChange={(e) => setNewPasswordconfirm(e.target.value)}
                      />
                      <label htmlFor="floatingInputGrid">New Password</label>
                    </div>
                  </div>
                  <div className="col-md">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="floatingInputGrid"
                        placeholder="new password confirm"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <label htmlFor="floatingInputGrid">
                        New Password Comfirm
                      </label>
                    </div>
                  </div>
                  <div className="col-md">
                    <div className="form-floating">
                      <button
                        type="submit"
                        onClick={handleUpdate}
                        className="btn btn-outline-success"
                        id="floatingInputGrid"
                      >
                        Submit{" "}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default UserInfo;
