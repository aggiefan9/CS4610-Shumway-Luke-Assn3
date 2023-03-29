import { useContext, useEffect, useState } from "react";
import { NavContext } from "../contexts/nav";

export const CreateReptile = () => {
  const setPage = useContext(NavContext);
  const [name, setName] = useState("");
  const [sex, setSex] = useState("M");
  const [species, setSpecies] = useState("King Snake");
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

  async function createReptile() {
    const body = {
      species: species.split(" ")[0].toLowerCase() + "_" + species.split(" ")[1].toLowerCase(),
      name,
      sex
    }
    if (name != "") {
      const result = await fetch(`http://localhost:3000/reptiles/create`, { // Need to fix the 
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
    <div className="CreateReptile">
      <h1 className="header">Create a Reptile</h1>
      <div className="container">
        <div >
          <form className="create">
            <div>
              <div>Name</div>
              <input value={name} onChange={e => setName(e.target.value)} type="text"/>
            </div>
            <div>
              <div>Sex</div>
              <select value={sex} onChange={e => setSex(e.target.value)}>
                <option>M</option>
                <option>F</option>
              </select>
            </div>
            <div>
              <div>Species</div>
              <select value={species} onChange={e => setSpecies(e.target.value)}>
                <option>King Snake</option>
                <option>Ball Python</option>
                <option>Redtail Boa</option>
                <option>Corn Snake</option>
              </select>
            </div>
            <button onClick={() => createReptile()}>Save</button>
          </form>
        </div>
      </div>
      <div className={`toast ${isDisplayed ? 'open' : ''}`}>An error occured. Please try again</div>
    </div>
  );
}