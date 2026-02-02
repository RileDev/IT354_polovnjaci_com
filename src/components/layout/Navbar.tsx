import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
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
import { useAuthStore } from "../../stores/authStore";
import { auth } from "../../services/firebase";

const Navbar = () => {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const displayName = user?.displayName || user?.email || "Korisnik";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-700/40 bg-zinc-900/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-500 transition-colors hover:text-blue-400"
        >
          <Car className="h-6 w-6" />
          <span>Polovnjaci.rs</span>
        </Link>

        <nav>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center gap-2 hover:bg-zinc-800 cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ""} alt={displayName} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{displayName}</span>
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
                  <Link to="/postavi-oglas" className="flex items-center gap-2 cursor-pointer">
                    <Car className="h-4 w-4" />
                    <span>Postavi oglas</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/reset-sifre" className="flex items-center gap-2 cursor-pointer">
                    <KeyRound className="h-4 w-4" />
                    <span>Resetuj sifru</span>
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
