import { useContext, useEffect, useState } from "react"
import { NavContext } from "../contexts/nav";
import { ReptileIdContext } from "../contexts/repId"

export const CreateHusbandry = () => {
    const reptileId = useContext(ReptileIdContext);
    const setPage = useContext(NavContext);
    const [length, setLength] = useState(0);
    const [weight, setWeight] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [temperature, setTemperature] = useState(0);
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


    async function createHusbandry() {
        const body = {
            length,
            weight,
            humidity,
            temperature
        }
        if (length != 0 && weight != 0 && humidity != 0 && temperature != 0) {
            const result = await fetch(`http://localhost:3000/husbandry/${reptileId}`, { // Need to fix the 
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
        <div className="createHusbandry">
            <h1 className="header">Create a Husbandry Record for Reptile #{reptileId}</h1>
            <div className="container">
                <form className="create">
                    <div>Length</div>
                    <input value={length} onChange={e => setLength(+e.target.value)} type="number"/>
                    <div>Weight</div>
                    <input value={weight} onChange={e => setWeight(+e.target.value)} type="number"/>
                    <div>Humidity</div>
                    <input value={humidity} onChange={e => setHumidity(+e.target.value)} type="number"/>
                    <div>Temperature</div>
                    <input value={temperature} onChange={e => setTemperature(+e.target.value)} type="number"/>
                </form>
                <button onClick={() => createHusbandry()}>Save</button>
            </div>
            <div className={`toast ${isDisplayed ? 'open' : ''}`}>An error occured. Please try again</div>
        </div>
    )
  }