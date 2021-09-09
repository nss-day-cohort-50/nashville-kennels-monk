import React, {useState} from "react"
import AnimalRepository from "../../repositories/AnimalRepository";

export const AnimalDialog = ({toggleDialog, animal, treatment, sync}) => {
    const [description, setDescription] = useState("")
    return <>{treatment  ? 
        <dialog id="dialog--animal" className="dialog--animal">
            <h2 style={{ marginBottom: "1.3em" }}>Medical History for {animal.name}</h2>
            {
                animal.treatments.map(t => (
                    <div key={t.id}>
                        <h4>{new Date(t.timestamp).toLocaleDateString("en-US")}</h4>
                        <p>{t.description}</p>
                    </div>
                ))
            }
            <button style={{
                position: "absolute",
                top: "1em",
                right: "2em"
            }}
                id="closeBtn"
                onClick={toggleDialog}>close</button>
        </dialog>
        :
        <dialog id="dialog--animal" className="dialog--animal">
            <h2 style={{ marginBottom: "1.3em" }}>Add Treatment for {animal.name}</h2>
            <label for="treatmentdis">Treatment Description</label>
            <textarea name="treatmentdis"placeholder="Enter Treatment Discription"rows="10" cols="55" onKeyUp={(event)=> setDescription(event.target.value)}></textarea>
            <button className="btn btn-warning mt-3 form-control small" onClick={()=>{
                const object = {
                    animalId: animal.id,
                    description: description,
                    timestamp: Date.now()

                }
                AnimalRepository.addTreatment(object)
                sync()
                toggleDialog()
                
            }}>Add Treatment</button>
            <button style={{
                position: "absolute",
                top: "1em",
                right: "2em"
            }}
                id="closeBtn"
                onClick={toggleDialog}>close</button>
        </dialog>
    }
    </>
}
