import React, { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"

import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import LocationRepository from "../../repositories/LocationRepository";


export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [animals, setAnimals] = useState([])
    const [employees, setEmployees] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const [ locations, updateLocations ] = useState([])
    const [locationId, setLocationId] = useState("")
    const history = useHistory()

    useEffect(() => {
        LocationRepository.getAll()
        .then((data)=> updateLocations(data))
    }, [])
    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(locationId)
        console.log(eId)
        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            
            const animal = {
                name: animalName,
                breed: breed,
                locationId: parseInt(locationId)
            }

            AnimalRepository.addAnimal(animal)
                .then(() => setEnabled(true))
                .then(() => history.push("/animals"))
        }
    }

    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>
            <div className="form-group">
                <label htmlFor="employee">Select a Location</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={e => setLocationId(e.target.value)}
                >
                    <option value="">Select a Location</option>
                    
                    {locations.map(l => (
                        <option key={l.id} id={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                 
                </select>
            </div>
            <button type="submit"
                onClick={constructNewAnimal}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
