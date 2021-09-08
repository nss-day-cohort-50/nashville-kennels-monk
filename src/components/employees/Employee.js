import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useHistory } from "react-router-dom";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"

export default ({ employee, updateEmployees }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    // const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const history = useHistory()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.locations?.length > 0) {
            markLocation(resource.locations[0].location);
        }
    }, [resource])

    useEffect(() => {
        if (resource?.animals?.length > 0) {
            setCount(resource.animals.length);
        }
    }, [resource])


    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource?.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>

                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for {animalCount} animals
                            </section>
                            <section>
                                {resource?.locations?.length > 0 ?
                                    `Working at ${resource?.locations.map(
                                        location => {
                                            return location.location.name
                                        }
                                    ).join(" and ")} location.`
                                    : `Employee not assigned location.`
                                }
                            </section>
                        </>
                        : ""
                }

                {
                    employeeId
                        ?
                        <button className="btn--fireEmployee" onClick={() => {
                            EmployeeRepository.delete(employeeId).then(
                                history.push('/employees')
                            )
                        }}>Fire</button>
                        : <button className="btn--fireEmployee" onClick={() => {
                            EmployeeRepository.delete(resource?.id)
                                .then(EmployeeRepository.getAll)
                                .then((data) => updateEmployees(data))
                        }}>Fire</button>
                }

            </section>

        </article >
    )
}
