import React, {useState, useEffect} from "react"
import {useHistory, useParams} from "react-router-dom"
import AnimalRepository from "../../repositories/AnimalRepository";

export const AddTreatment = () =>{
    const [description, setDescription] = useState("")
    const { animalId } = useParams()
    const [animal, setAnimal] = useState({})
    const history = useHistory()
    useEffect(() => {
        AnimalRepository.get(animalId)
        .then((data) => {
            setAnimal(data)
        })
    },[])
    return (<>
        <form id="dialog--animal" className="dialog--animal">
        <h2 style={{ marginBottom: "1.3em" }}>Add Treatment for {animal.name}</h2>
        <label for="treatmentdis">Treatment Description</label><br />
        <textarea name="treatmentdis"placeholder="Enter Treatment Discription"rows="10" cols="55" onKeyUp={(event)=> setDescription(event.target.value)}></textarea>
        <button className="btn btn-warning mt-3 form-control small" onClick={()=>{
            const object = {
                animalId: animal.id,
                description: description,
                timestamp: Date.now()

            }
            AnimalRepository.addTreatment(object).then(
                history.push("/animals")
                )
            
            
            
            
        }}>Add Treatment</button>
        <button style={{
            position: "absolute",
            top: "1em",
            right: "2em"
        }}
            id="closeBtn"
            onClick={()=>{
                history.push("/animals")
            }}>close</button>
    </form>
        
        
        </>)
}