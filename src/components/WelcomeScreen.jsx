import React from 'react';
import { useState, useEffect } from 'react';
// import { Authenticate, Deauthenticate, Signup, Login } from '../auth';
import { mockData } from '../assets/mockDatajs';

function WelcomeScreen({ login, setLogin }) {
    const [curr_username, setUsername] = useState('');
    const [curr_password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSignUp = () => {
        const login_info = {
            "username": curr_username,
            "password": curr_password,
            "task": "signup",
            "auth": false,
            "servers": []
        };
        setLogin(login_info);
        // console log the login info
        // console.log(`[DEBUG] login: ${login_info.username}`);
        // console.log(`[DEBUG]  password: ${login_info.password}`);
        // console.log(`[DEBUG]  task: ${login_info.task}`);
        // console.log(`[DEBUG]  auth: ${login_info.auth}`);
        // try {
        //   Signup(login); // Call Signup
        //   Login(login); // Auto-login after signup
        //   console.log(`[DEBUG] User ${username} signed up and logged in`);
        // } catch (err) {
        //   console.error(err);
        //   setError('Signup failed. Please try again.');
        // }
    };

    useEffect(() => {
        console.log('[DEBUG] Welcome Screen rendered');
    }, []);

    const handleLogin = () => {
        const login_info= {
            "username": curr_username,
            "password": curr_password,
            "task": "login",
            "auth": false,
            "servers": []
        };
        setLogin(login_info);
        // console.log(`[DEBUG] login: ${login_info.username}`);
        // console.log(`[DEBUG]  password: ${login_info.password}`);
        // console.log(`[DEBUG]  task: ${login_info.task}`);
        // console.log(`[DEBUG]  auth: ${login_info.auth}`);
        // try {
        //   Login(login); // Call Login
        //   console.log(`[DEBUG] User ${username} logged in`);
        // } catch (err) {
        //   console.error(err);
        //   setError('Login failed. Please try again.');
        // }
    };

    useEffect(() => {
        if (login) {
            // console.log(`[DEBUG] Updated login state:`);
            // console.log(`[DEBUG] username: ${login.username}`);
            // console.log(`[DEBUG] password: ${login.password}`);
            // console.log(`[DEBUG] task: ${login.task}`);
            // console.log(`[DEBUG] auth: ${login.auth}`);
        }
    }, [login]); // to see the changes
    

    return (
        <div>
          <h1>Welcome</h1>
          {/* <form> */}
            <input
                type="text"
                placeholder="Username"
                value={curr_username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={curr_password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignUp}>Sign Up</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          {/* </form> */}
        </div>
    );
}

export default WelcomeScreen;