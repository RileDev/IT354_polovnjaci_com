import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import Homepage from "./pages/Homepage.tsx";
import Layout from "./components/layout/Layout.tsx";
import CarListPage from "./pages/CarListPage.tsx";
import CarDetailsPage from "./pages/CarDetailsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { useAuthStore } from "./stores/authStore.ts";
import { auth } from "./services/firebase.ts";
import type { IUser } from "./types";
import UserProfilePage from "./pages/UserProfilePage.tsx";

const mapAuthUser = (user: FirebaseUser | null): IUser | null =>
  user
    ? {
        uid: user.uid,
        email: user.email ?? undefined,
        name: user.displayName ?? undefined,
        username: user.email ? user.email.split("@")[0] : undefined,
        avatar: user.photoURL ?? undefined,
      }
    : null;

const App = () => {
  const { setUser, setToken, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        setUser(mapAuthUser(currentUser));
        const token = await currentUser.getIdToken();
        setToken(token);
      } else {
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setToken, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="oglasi" element={<CarListPage />} />
          <Route path="oglas/:id" element={<CarDetailsPage />} />
          <Route path="prijava" element={<LoginPage />} />
          <Route path="registracija" element={<RegisterPage />} />
          <Route path="profil" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
