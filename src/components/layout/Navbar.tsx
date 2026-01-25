import { Link } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Car, User, KeyRound, FileText, LogOut } from "lucide-react";

const Navbar = () => {
    // const { user, logout } = useAuth();
    const user = null;

    const handleLogout = () => {
        // logout();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-700/40 bg-zinc-900/95 backdrop-blur">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-xl font-bold text-blue-500 transition-colors hover:text-blue-400"
                >
                    <Car className="h-6 w-6" />
                    <span>Polovnjaci.rs</span>
                </Link>

                {/* Auth Section */}
                <nav>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 hover:bg-zinc-800"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.username} />
                                        <AvatarFallback className="bg-blue-500 text-white">
                                            {user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline">{user.username}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link to="/profil" className="flex items-center gap-2 cursor-pointer">
                                        <User className="h-4 w-4" />
                                        <span>Pregled profila</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/reset-sifre" className="flex items-center gap-2 cursor-pointer">
                                        <KeyRound className="h-4 w-4" />
                                        <span>Resetuj šifru</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/moji-oglasi" className="flex items-center gap-2 cursor-pointer">
                                        <FileText className="h-4 w-4" />
                                        <span>Moji oglasi</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Odjavite se</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" asChild>
                                <Link to="/prijava">Prijava</Link>
                            </Button>
                            <Button variant="secondary" asChild>
                                <Link to="/registracija">Registracija</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
