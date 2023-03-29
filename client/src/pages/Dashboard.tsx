import { useContext, useEffect, useState } from "react";
import { NavContext } from "../contexts/nav";
import { ReptileContext } from "../contexts/reptile";

type Reptile = {
  id: number;
  userId: number;
  species: string;
  name: string;
  sex: string;
}

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

export const Dashboard = () => {
  const setPage = useContext(NavContext);
  const setReptileId = useContext(ReptileContext);
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  let date = new Date();
  const day = date.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
  function getReptiles() {
    fetch("http://localhost:3000/reptiles", {
      method: "get",
      credentials: "include",
    })
    .then(r => {
      if (!r.ok) {
        throw new Error(r.statusText)
      }
      return r.json();
    })
    .then(json => {setReptiles(json.reptiles)})
  }
  
  function deleteReptile(id: number) {
    fetch(`http://localhost:3000/reptiles/delete/${id}`, {
      method: "post",
      credentials: "include"
    })
      .then(() => getReptiles());
  }

  useEffect(() => {
    getReptiles();
  }, [reptiles]);

  function getSchedules() {
    fetch("http://localhost:3000/schedules", {
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
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="schedules">
        <h2>Schedules</h2>
        Schedules for Today: {days[day]}
        {
          schedules.map((schedule) => (
            <div key={schedule.id} className="schedule">
              {( (schedule.monday && day===1) ||
                  (schedule.tuesday && day===2) ||
                  (schedule.wednesday && day===3) ||
                  (schedule.thursday && day===4) ||
                  (schedule.friday && day===5) ||
                  (schedule.saturday && day===6) ||
                  (schedule.sunday && day===0)) ? <div>
                    <p>
                      Description: {schedule.description} for Reptile #{schedule.reptileId}
                    </p><p>
                      Monday: {schedule.monday ? 'Yes' : 'No' }
                    </p><p>
                      Tuesday: {schedule.tuesday ? 'Yes' : 'No' }
                    </p><p>
                      Wednesday: {schedule.wednesday ? 'Yes' : 'No' }
                    </p><p>
                      Thursday: {schedule.thursday ? 'Yes' : 'No' }
                    </p><p>
                      Friday: {schedule.friday ? 'Yes' : 'No' }
                    </p><p>
                      Saturday: {schedule.saturday ? 'Yes' : 'No' }
                    </p><p>
                      Sunday: {schedule.sunday ? 'Yes' : 'No' }
                    </p>
                  </div>
                : <div></div>}
            </div>
          ))
        }
      </div>
      <div className="reptiles">
        <h2>Reptiles</h2>
        {
          reptiles.map((reptile) => (
            <div key={reptile.id} className="reptile" >
              <p className="Delete"><button onClick={() => deleteReptile(reptile.id)}>Delete</button></p>
              <div onClick={() => { setReptileId(reptile.id); setPage("reptile"); }}>
                <p>ID: {reptile.id}</p>
                <p>Species: {reptile.species.split("_")[0]} {reptile.species.split("_")[1]}</p>
                <p>Name: {reptile.name}</p>
                <p>Sex: {reptile.sex}</p>
              </div>
            </div>
          ))
        }
        <button onClick={() => setPage("createReptile")}>Add a Reptile</button>
      </div>
    </div>
  );
}