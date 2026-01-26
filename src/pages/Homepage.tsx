import {api} from "../services/firebase.ts";
import type {ICar} from "../types";
import {useEffect, useState} from "react";

const Homepage = () => {

    const [cars, setCars] = useState<ICar[]>()

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (async () => {
            try{
                const data = await api.get<Record<string, ICar> | null>("cars")

                const list = data
                    ? Object.entries(data).map(([id, car]) => ({
                        ...car,
                        _id: car._id ?? id, // optional: fall back to firebase key
                    }))
                    : [];

                setCars(list);
            }catch (e){
                console.log(e)
            }
        })()
    }, [])
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Pronađite savršen automobil</h1>
            {console.log(cars)}
        </div>
    )
}
export default Homepage
