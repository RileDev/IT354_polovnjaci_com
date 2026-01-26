import {BrowserRouter, Route, Routes} from "react-router";
import Homepage from "./pages/Homepage.tsx";
import Layout from "./components/layout/Layout.tsx";
import CarListPage from "./pages/CarListPage.tsx";
import CarDetailsPage from "./pages/CarDetailsPage.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />}/>
                    <Route path="oglasi" element={<CarListPage />}/>
                    <Route path="oglas/:id" element={<CarDetailsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>

    )
}
export default App
