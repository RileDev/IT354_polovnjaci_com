import {BrowserRouter, Route, Routes} from "react-router";
import Homepage from "./pages/Homepage.tsx";
import Layout from "./components/layout/Layout.tsx";
import CarListPage from "./pages/CarListPage.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />}/>
                    <Route path="oglasi" element={<CarListPage />}/>

                </Route>
            </Routes>
        </BrowserRouter>

    )
}
export default App
