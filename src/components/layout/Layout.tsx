import Navbar from "./Navbar.tsx";
import {Outlet} from "react-router";
import Footer from "./Footer.tsx";

const Layout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-900 text-zinc-100">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
export default Layout
