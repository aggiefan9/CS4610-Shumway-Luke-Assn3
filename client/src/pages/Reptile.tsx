import { useContext } from "react"
import { ReptileIdContext } from "../contexts/repId"

export const Reptile = () => {
  const reptileId = useContext(ReptileIdContext);
  return <h1>Welcome to the page for Reptile #{reptileId}</h1>
}