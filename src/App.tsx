import {BrowserRouter, Route, Routes} from "react-router";
import Homepage from "./pages/Homepage.tsx";
import Layout from "./components/layout/Layout.tsx";
import CarListPage from "./pages/CarListPage.tsx";
import CarDetailsPage from "./pages/CarDetailsPage.tsx";
import {useAuthStore} from "./stores/authStore.ts";
import {useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "./services/firebase.ts"

const App = () => {
    const {setUser, setToken, setLoading, logout} = useAuthStore()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true)

            if(currentUser){
                const token = await currentUser.getIdToken()
                setToken(token)
            }else{
                logout()
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [setUser, setToken, setLoading, logout])


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
