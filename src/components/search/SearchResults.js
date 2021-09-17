import React, {useEffect, useState}from "react"
import { useLocation, useHistory } from "react-router-dom";
import "./SearchResults.css"
import { Animal } from "../animals/Animal"
import  Location  from "../locations/Location";
import Employee from "../employees/Employee";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";

export default () => {
    const location = useLocation()
    const { getCurrentUser } = useSimpleAuth()
    const [isEmployee, setAuth] = useState(false)
    useEffect(()=>{
        setAuth(getCurrentUser().employee)
    },[])
    const displayAnimals = () => {
        if (location.state?.animals.length) {
            return (
                <React.Fragment>
                    <h2>Matching Animals</h2>
                    <section className="animals">
                        
                        {isEmployee ?location.state.animals.map((animal)=>{
                            return(<Animal key={animal.id} animal={animal}/>)
                        }):<p>You must be an employee to Search Animals</p>}
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayEmployees = () => {
        if (location.state?.employees.length) {
            return (
                <React.Fragment>
                    <h2>Matching Employees</h2>
                    <section className="employees">
                        Display matching employees
                        {location.state?.employees.map((employee)=>{
                            return(<Employee key={employee.id} employee={employee}/>)
                        })}
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayLocations = () => {
        if (location.state?.locations.length) {
            return (
                <React.Fragment>
                    <h2>Matching Locations</h2>
                    <section className="locations">
                        Display matching locations
                        {location.state?.locations.map((location)=>{
                            return(<Location key={location.id}location={location}/>)
                        })}
                    </section>
                </React.Fragment>
            )
        }
    }

    return (
        <React.Fragment>
            <article className="searchResults">
                {displayEmployees()}
                {displayLocations()}
                {displayAnimals()}
            </article>
        </React.Fragment>
    )
}
