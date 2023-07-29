import React, { useContext, useState } from "react";
import server from "../apis/server"
import { useHistory } from 'react-router-dom';
import Cookies from "js-cookie";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await server.get('/login', { params: { email: email, password: password } });
            console.log(response.data.status);
            if (response.data.status === "success") {
                Cookies.set('email', email);
                Cookies.set('LogedIn', "true");
				Cookies.set("userid", response.data.data.userid);
                const user = response.data.data;
                const privilege = user.privilege;
                privilege === 1?Cookies.set('privilege', 'admin'):Cookies.set('privilege', 'user');
                history.push(privilege?'/admin':'/user_page');
            }
            else {
                alert("Password is incorrect");
            }
        } catch (error) {
            alert("Incorrect username!");
        }

    }
    return (
        <div className="d-flex justify-content-center align-items-center p-5 m-5 align-center">
            <div className="container rounded border border-primary p-3 col-sm-3">
                <form>
                    <div className="form-outline mb-3 col-sm">
                        <input type="email" className="form-control" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-outline mb-3">
                        <input type="password" className="form-control"  placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="button" className="btn btn-primary btn-block" onClick={handleSubmit}>Log in</button>
                </form>
            </div>
        </div>
    )
}

export default LoginForm