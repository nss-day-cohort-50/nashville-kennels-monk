import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import "./AnimalCard.css"

export const Animal = ({ animal, syncAnimals,
    showTreatmentHistory, owners }) => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEmployee, setAuth] = useState(false)
    const [myOwners, setPeople] = useState([])
    const [CareTakers, setCaretaker ] = useState([])
    const [allOwners, registerOwners] = useState([])
    const [allCareTakers, registerCaretakers ] = useState([])
    const [classes, defineClasses] = useState("card animal")
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(animal, animalId, AnimalRepository.get)
    }, [])

    useEffect(() => {
        if (owners) {
            registerOwners(owners)
        }
    }, [owners])

    useEffect(() => {
        EmployeeRepository.getAll()
            .then((data)=>{ debugger 
                const filterCareTakers = data.filter((item)=> item.employeeLocations.locationId === animal.locationId)
                setCaretaker(filterCareTakers) 
            })
               
    }, [])



    const getPeople = () => {
        return AnimalOwnerRepository
            .getOwnersByAnimal(currentAnimal.id)
            .then(people => setPeople(people))
    }

    const getCareTakers = () => {
        return AnimalOwnerRepository//Chcek source (maybe animalrepository)
            .getOwnersByAnimal(currentAnimal.id)
            .then(people => setPeople(people))
    }

    useEffect(() => {
        getPeople()
    }, [currentAnimal])

    useEffect(() => {
        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)

            AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                .then(() => {
                    OwnerRepository.getAllCustomers().then(registerOwners)
                })
        }
    }, [animalId])

    return (
        <>
            <li className={classes}>
                <div className="card-body">
                    <div className="animal__header">
                        <h5 className="card-title">
                            <button className="link--card btn btn-link"
                                style={{
                                    cursor: "pointer",
                                    "textDecoration": "underline",
                                    "color": "rgb(94, 78, 196)"
                                }}
                                onClick={() => {
                                    if (isEmployee) {
                                        showTreatmentHistory(currentAnimal)
                                    }
                                    else {
                                        history.push(`/animals/${currentAnimal.id}`)
                                    }
                                }}> {currentAnimal.name} </button>
                        </h5>
                        <span className="card-text small">{currentAnimal.breed}</span>
                    </div>

                    <details open={detailsOpen}>
                        <summary className="smaller">
                            <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                        </summary>

                        <section>
                            <h6>Caretaker(s)</h6>
                            <span className="small">
                            {currentAnimal.animalCaretakers?.length>0 ? currentAnimal.animalCaretakers.map((caretaker)=>{
                                  console.log(CareTakers)
                                  return(<p>{caretaker.user.name}</p>)
                                }):<p>No Caretaker</p>}                                                       
                                                       
                            </span>
                            {
                                currentAnimal.animalCaretakers?.length < 2
                                    ? <select defaultValue=""
                                        name="caretaker"
                                        className="form-control small"
                                        onChange={() => {}} >
                                        <option value="">
                                            Select {currentAnimal.animalCaretakers.length === 1 ? "another" : "a"} Caretaker
                                        </option>
                                        {
                                            allCareTakers.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)
                                        }
                                    </select>
                                    : null
                            }


                            <h6>Owners</h6>
                            <span className="small">                              
                                                           {currentAnimal.animalOwners?.length>0 ? currentAnimal.animalOwners.map((owner)=>{
                                  return(<p>{owner.user.name}</p>)
                              }):<p>No Owners</p>} 
                                {/* Honey Rae Repairs */}
                               
                            </span>

                            {
                                myOwners.length < 2
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={() => {}} >
                                        <option value="">
                                            Select {myOwners.length === 1 ? "another" : "an"} owner
                                        </option>
                                        {
                                            allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }


                            {
                                detailsOpen && "treatments" in currentAnimal
                                    ? <div className="small">
                                        <h6>Treatment History</h6>
                                        {
                                            currentAnimal.treatments.map(t => (
                                                <div key={t.id}>
                                                    <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                        {new Date(t.timestamp).toLocaleString("en-US")}
                                                    </p>
                                                    <p>{t.description}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : ""
                            }

                        </section>

                        {
                            isEmployee
                                ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                    AnimalOwnerRepository
                                        .removeOwnersAndCaretakers(currentAnimal.id)
                                        .then(() => {AnimalRepository.delete(currentAnimal.id)}) // Remove animal
                                        .then(() => {syncAnimals()}) // Get all animals
                                }>Discharge</button>
                                : ""
                        }
                        {
                            isEmployee
                                ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                    AnimalOwnerRepository
                                        .removeOwnersAndCaretakers(currentAnimal.id)
                                        .then(() => {}) // Remove animal
                                        .then(() => {}) // Get all animals
                                }>Discharge</button>
                                : ""
                        }

                    </details>
                </div>
            </li>
        </>
    )
}
