import { useContext, useEffect, useState } from "react"
import { NavContext } from "../contexts/nav";
import { ReptileIdContext } from "../contexts/repId"

type Schedule = {
  id: number;
  reptileId: number;
  userId: number;
  type: string;
  description: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

type Feeding = {
  id: number;
  reptileId: number;
  foodItem: string;
}

type Husbandry = {
  id: number;
  reptileId: number;
  length: number;
  weight: number;
  temperature: number;
  humidity: number;
}

type Reptile = {
  id: number;
  species: string;
  name: string;
  sex: string;
}

export const Reptile = () => {
  const reptileId = useContext(ReptileIdContext);
  const setPage = useContext(NavContext);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [feedings, setFeedings] = useState<Feeding[]>([]);
  const [husbandries, setHusbandries] = useState<Husbandry[]>([]);
  const [reptile, setReptile] = useState<Reptile>();
  
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
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

  async function saveReptile() {
    const body = {
      species: species.split(" ")[0].toLowerCase() + "_" + species.split(" ")[1].toLowerCase(),
      name,
      sex
    }
    if (name != "") {
      const result = await fetch(`http://localhost:3000/reptiles/update/${reptileId}`, { // Need to fix the 
        method: 'post',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body)
      });
      const res = await result.json()
      if (!res.message) {
        setIsEdit(false);
      } else {
        setIsDisplayed(true);
      }
    } else {
      setIsDisplayed(true);
    }
  }
  
  function getReptile() {
    fetch(`http://localhost:3000/reptiles`, {
      method: "get",
      credentials: "include",
    })
    .then(r => {
      if (!r.ok) {
        throw new Error(r.statusText)
      }
      return r.json();
    })
    .then(json => {
      for (let rep of json.reptiles) {
        if (rep.id === reptileId) {
          setReptile(rep);
        }
      }
    })
  }

  useEffect(() => {
    getReptile();
  }, [isEdit]);
  
  const [name, setName] = useState((reptile) ? reptile.name : "");
  const [sex, setSex] = useState((reptile) ? reptile.species : "M");
  const [species, setSpecies] = useState((reptile) ? reptile.species : "King Snake");
  
  function getHusbandries() {
    fetch(`http://localhost:3000/husbandry/${reptileId}`, {
      method: "get",
      credentials: "include",
    })
    .then(r => {
      if (!r.ok) {
        throw new Error(r.statusText)
      }
      return r.json();
    })
    .then(json => {setHusbandries(json.records)})
  }
  
  useEffect(() => {
    getHusbandries();
  }, [husbandries]);

  function getFeedings() {
    fetch(`http://localhost:3000/feedings/${reptileId}`, {
      method: "get",
      credentials: "include",
    })
    .then(r => {
      if (!r.ok) {
        throw new Error(r.statusText)
      }
      return r.json();
    })
    .then(json => {setFeedings(json.feedings)})
  }
  
  useEffect(() => {
    getFeedings();
  }, [feedings]);

  function getSchedules() {
    fetch(`http://localhost:3000/schedules/${reptileId}`, {
      method: "get",
      credentials: "include",
    })
    .then(r => {
      if (!r.ok) {
        throw new Error(r.statusText)
      }
      return r.json();
    })
    .then(json => {setSchedules(json.schedules)})
  }
  
  useEffect(() => {
    getSchedules();
  }, [schedules]);

  return (
    <div>
      <h1 className="header">Reptile</h1>
        <div className="container">
          {!isEdit ? <div>
            <h2>Info</h2>
            <div>Name: {reptile?.name}</div>
            <div>Species: {reptile?.species.split("_")[0]} {reptile?.species.split("_")[1]}</div>
            <div>Sex: {reptile?.sex}</div>
            <button onClick={() => setIsEdit(true)}>Edit</button>
          </div> : <div>
            <form>
              <h2>Info</h2>
              <div>Name: <input value={name} onChange={e => setName(e.target.value)}/></div>
              <div>Species: <select value={species} onChange={e => setSpecies(e.target.value)}>
                <option>King Snake</option>
                <option>Ball Python</option>
                <option>Redtail Boa</option>
                <option>Corn Snake</option>
              </select></div>
              <div>Sex: <select value={sex} onChange={e => setSex(e.target.value)}>
                <option>M</option>
                <option>F</option>
              </select></div>
            </form>
            <button onClick={() => saveReptile()}>Save</button>
          </div>}
          <div className="list">
            <h2>Feedings</h2>
            {
              feedings.map((feeding) => (
                <div key={feeding.id} className="feeding">
                  Food: {feeding.foodItem}
                </div>
              ))
            }
            <button onClick={() => setPage("createFeeding")}>Add a Feeding</button>
          </div>
          <div className="list">
            <h2>Husbandry Records</h2>
            {
              husbandries.map((husbandry) => (
                <div key={husbandry.id} className="husbandry">
                  <div>Length: {husbandry.length}</div>
                  <div>Weight: {husbandry.weight}</div>
                  <div>Temperature: {husbandry.temperature}</div>
                  <div>Humidity: {husbandry.humidity}</div>
                </div>
              ))
            }
            <button onClick={() => setPage("createHusbandry")}>Add a Husbandry Record</button>
          </div>
          <div className="list">
            <h2>Schedules</h2>
            {
              schedules.map((schedule) => (
                <div key={schedule.id} className="schedule">
                  <div>
                    <div>
                      Description: {schedule.description} for Reptile #{schedule.reptileId}
                    </div><div>
                      Monday: {schedule.monday ? 'Yes' : 'No' }
                    </div><div>
                      Tuesday: {schedule.tuesday ? 'Yes' : 'No' }
                    </div><div>
                      Wednesday: {schedule.wednesday ? 'Yes' : 'No' }
                    </div><div>
                      Thursday: {schedule.thursday ? 'Yes' : 'No' }
                    </div><div>
                      Friday: {schedule.friday ? 'Yes' : 'No' }
                    </div><div>
                      Saturday: {schedule.saturday ? 'Yes' : 'No' }
                    </div><div>
                      Sunday: {schedule.sunday ? 'Yes' : 'No' }
                    </div>
                  </div>
                </div>
              ))
            }
            <button onClick={() => setPage("createSchedule")}>Add a Schedule</button>
          </div>
        </div>
        <div className={`toast ${isDisplayed ? 'open' : ''}`}>An error occured. Please try again</div>
      </div>
  )
}