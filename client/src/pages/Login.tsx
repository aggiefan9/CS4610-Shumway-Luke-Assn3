import { useEffect, useState } from "react";
import { useContext } from "react";
import { NavContext } from "../contexts/nav";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setPage = useContext(NavContext);
  
  const [isDisplayed, setIsDisplayed] = useState(false);
  useEffect(() => {
    if (isDisplayed) {
      const timeout = setTimeout(() => {
        setIsDisplayed(false);
      }, 2000);
      return () => {
        clearTimeout(timeout);
      }
    }
    return () => {};
  }, [isDisplayed]);

  async function logIn() {
    const body = {
      email,
      password
    };
    const result = await fetch(`http://localhost:3000/users/login`, { // Need to fix the 
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body)
    });
    const res = await result.json()
    if (!res.message) {
      setPage("dashboard");
    } else {
      setIsDisplayed(true);
    }
  }
  
  return (
    <div className="login">
      <div>
        <h1 className="header">Login</h1>
      </div>
      <div className="container">
        <div>
          <form className="login-form">
            <div>
                <p>Email</p>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
            </div>
            <div>
                <p>Password</p>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
            </div>
            
            <button type="button" onClick={logIn}>Log In</button>
          </form>
        </div>
      </div>
      <div className={`toast ${isDisplayed ? 'open' : ''}`}>An error occured. Please try again</div>
    </div>
    );
  }