import React from 'react'
import {Button} from "./components/ui/button.tsx";

const App = () => {
    return (
        <div className="bg-background text-foreground flex min-h-svh flex-col items-center justify-center">
            <h1>IT354 Projekat - Polovnjaci.com</h1>
            <Button className="cursor-pointer">Click me</Button>
        </div>
    )
}
export default App
