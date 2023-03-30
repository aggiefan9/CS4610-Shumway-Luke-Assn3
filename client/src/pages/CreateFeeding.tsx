import { useContext, useEffect, useState } from "react"
import { NavContext } from "../contexts/nav";
import { ReptileIdContext } from "../contexts/repId"

export const CreateFeeding = () => {
    const reptileId = useContext(ReptileIdContext);
    const setPage = useContext(NavContext);
    const [foodItem, setFoodItem] = useState("");
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
  
    async function createFeeding() {
      const body = {
        foodItem,
        reptileId
      }
      if (foodItem != "") {
        const result = await fetch(`http://localhost:3000/feedings/${reptileId}`, { // Need to fix the 
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
        <div className="CreateFeeding">
            <h1 className="header">Create a Feeding for Reptile #{reptileId}</h1>
            <div className="container">
                <form className="create">
                    <div>Food Item</div>
                    <input value={foodItem} onChange={e => setFoodItem(e.target.value)} />
                    <button onClick={() => createFeeding()}>Save</button>
                </form>
            </div>
            <div className={`toast ${isDisplayed ? 'open' : ''}`}>An error occured. Please try again</div>
        </div>
    )
  }