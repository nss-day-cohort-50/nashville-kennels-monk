import React from "react"
import { Route } from "react-router-dom"
import { AddTreatment } from "./animals/AddTreatMent"
import {Animal} from "./animals/Animal"
import AnimalForm from "./animals/AnimalForm"
import { AnimalListComponent } from "./animals/AnimalList"

export default () => {
    return (
        <>
            <Route exact path="/animals">
                <AnimalListComponent />
            </Route>
            <Route path="/animals/:animalId(\d+)">
                <Animal />
            </Route>
            <Route path="/animals/new">
                <AnimalForm />
            </Route>
            <Route path="/addtreatment/:animalId(\d+)">
                <AddTreatment />
            </Route>
        </>
    )
}
