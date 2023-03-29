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

export const Reptile = () => {
  const reptileId = useContext(ReptileIdContext);
  const setPage = useContext(NavContext);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

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
    <div className="schedules">
        <h2>Schedules</h2>
        Schedules for Reptile
        {
          schedules.map((schedule) => (
            <div key={schedule.id} className="schedule">
              <div>
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
            </div>
          ))
        }
      </div>
  )
}