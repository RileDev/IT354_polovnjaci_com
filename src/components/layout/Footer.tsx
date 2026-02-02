import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-700/40 bg-zinc-900">
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-lg font-bold text-blue-500"
                        >
                            <Car className="h-5 w-5" />
                            <span>Polovnjaci.com</span>
                        </Link>
                        <p className="mt-2 text-sm text-zinc-400">
                            Vaše pouzdano tržište za polovne automobile.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">Brzi linkovi</h3>
                        <ul className="mt-2 space-y-1 text-sm text-zinc-400">
                            <li>
                                <Link to="/" className="hover:text-zinc-100 transition-colors">
                                    Početna
                                </Link>
                            </li>
                            <li>
                                <Link to="/oglasi" className="hover:text-zinc-100 transition-colors">
                                    Svi oglasi
                                </Link>
                            </li>
                            <li>
                                <Link to="/postavi-oglas" className="hover:text-zinc-100 transition-colors">
                                    Postavi oglas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold">Kontakt</h3>
                        <ul className="mt-2 space-y-1 text-sm text-zinc-400">
                            <li><a href="mailto:info@polovnjaci.com" className="hover:text-zinc-100 transition-colors">Email: info@polovnjaci.com</a></li>
                            <li><a href="tel:+381 11 123 4567" className="hover:text-zinc-100 transition-colors">Telefon: +381 11 123 4567</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-zinc-700/40 pt-4 text-center text-sm text-zinc-400">
                    <p>&copy; {currentYear} Polovnjaci.com. Sva prava zadržana.</p>
                    <p>Created by: Luka Ristić 6001</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
