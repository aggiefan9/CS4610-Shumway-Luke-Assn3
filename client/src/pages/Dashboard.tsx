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
    <div className="">
      <h1 className="header">Dashboard</h1>
      <div className="container">
        <div className="list">
          <h2>Schedules</h2>
          <p>Schedules for Today: {days[day]}</p>
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
                  : <div></div>}
              </div>
            ))
          }
        </div>
        <div className="list">
          <h2>Reptiles</h2>
          {
            reptiles.map((reptile) => (
              <div key={reptile.id} className="reptile" >
                <div className="Delete"><button onClick={() => deleteReptile(reptile.id)}>Delete</button></div>
                <div onClick={() => { setReptileId(reptile.id); setPage("reptile"); }}>
                  <div>ID: {reptile.id}</div>
                  <div>Species: {reptile.species.split("_")[0]} {reptile.species.split("_")[1]}</div>
                  <div>Name: {reptile.name}</div>
                  <div>Sex: {reptile.sex}</div>
                </div>
              </div>
            ))
          }
          <button onClick={() => setPage("createReptile")}>Add a Reptile</button>
        </div>
      </div>
    </div>
  );
}