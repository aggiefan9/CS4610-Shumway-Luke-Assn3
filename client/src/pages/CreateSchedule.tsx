import { useContext, useEffect, useState } from "react"
import { NavContext } from "../contexts/nav";
import { ReptileIdContext } from "../contexts/repId"

export const CreateSchedule = () => {
  const reptileId = useContext(ReptileIdContext);
  const setPage = useContext(NavContext);
  const [type, setType] = useState("feed");
  const [description, setDescription] = useState("");
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
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


  async function createSchedule() {
      const body = {
          type,
          description,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday
      }
      if (description != "") {
          const result = await fetch(`http://localhost:3000/schedules/${reptileId}`, { // Need to fix the 
            method: 'post',
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body)
          });
          const res = await result.json();
          if (!res.message) {
            setPage("reptile");
          } else {
            setIsDisplayed(true);
          }
        } else {
          setIsDisplayed(true);
        }
  }

  return (
    <div className="createSchedule">
      <h1 className="header">Create a Schedule for Reptile #{reptileId}</h1>
        <div className="container">
          <form className="create">
            <div>Type</div>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option>feed</option>
              <option>clean</option>
              <option>record</option>
            </select>
            <div>Description</div>
            <input value={description} onChange={e => setDescription(e.target.value)}/>
            <div>Monday</div>
            <input type="checkbox" checked={monday} onChange={() => setMonday(!monday)}/>
            <div>Tuesday</div>
            <input type="checkbox" checked={tuesday} onChange={() => setTuesday(!tuesday)}/>
            <div>Wednesday</div>
            <input type="checkbox" checked={wednesday} onChange={() => setWednesday(!wednesday)}/>
            <div>Thursday</div>
            <input type="checkbox" checked={thursday} onChange={() => setThursday(!thursday)}/>
            <div>Friday</div>
            <input type="checkbox" checked={friday} onChange={() => setFriday(!friday)}/>
            <div>Saturday</div>
            <input type="checkbox" checked={saturday} onChange={() => setSaturday(!saturday)}/>
            <div>Sunday</div>
            <input type="checkbox" checked={sunday} onChange={() => setSunday(!sunday)}/>
          </form>
          <button onClick={() => createSchedule()}>Save</button>
        </div>
        <div className={`toast ${isDisplayed ? 'open' : ''}`}>An error occured. Please try again</div>
    </div>
  )
  }