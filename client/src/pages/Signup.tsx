import { useContext, useEffect, useState } from "react";
import { NavContext } from "../contexts/nav";

export const Signup = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
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
  
  async function signup() {
    const body = {
      firstName,
      lastName,
      email,
      password
    };
    if (firstName != "" && lastName != "" && email != "" && password != "") {
      const result = await fetch(`http://localhost:3000/users/create`, { // Need to fix the 
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
    } else {
      setIsDisplayed(true);
    }
  }
  
  return (
      <div className="signup">
        <div>
          <h1 className="header">Signup</h1>
        </div>
        <div className="container">
          <form className="signup-form">
          <div>
                <p>First Name</p>
                <input value={firstName} onChange={e => setFirstname(e.target.value)} type="text" />
            </div>
            <div>
                <p>Last Name</p>
                <input value={lastName} onChange={e => setLastname(e.target.value)} type="text" />
            </div>
            <div>
                <p>Email</p>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
            </div>
            <div>
                <p>Password</p>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
            </div>
            <button type="button" onClick={signup}>Sign Up</button>
          </form>
        </div>
        <div className={`toast ${isDisplayed ? 'open' : ''}`}>An error occured. Please try again</div>
      </div>
    );
  }