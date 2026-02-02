import { Button } from "../components/ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import {useAuthStore} from "../stores/authStore.ts";
import {Input} from "../components/ui/input.tsx";

const UserProfilePage = () => {
  const { user } = useAuthStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Moj profil</h1>

      <div className="mx-auto max-w-2xl ">
        {/* Profile Header */}
        <div className="mb-6 flex items-center rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg gap-4 p-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="text-2xl">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || "Korisnik"}</h2>
            <p className="text-muted-foreground">@{user?.username}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form className="space-y-6">
          <div className="rounded-lg rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg p-6">
            <h2 className="mb-4 font-semibold">Lični podaci</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Ime i prezime</label>
                <Input
                  type="text"
                  defaultValue={user?.name}
                  className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500 disabled:border-zinc-700 disabled:bg-zinc-900/60 disabled:text-zinc-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Korisničko ime</label>
                <Input
                  type="text"
                  defaultValue={user?.username}
                  disabled
                  className="border-zinc-700 bg-zinc-900/60 text-zinc-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="border-zinc-700 bg-zinc-900/60 text-zinc-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Broj telefona</label>
                <Input
                  type="tel"
                  defaultValue={user?.phoneNum}
                  className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500 disabled:border-zinc-700 disabled:bg-zinc-900/60 disabled:text-zinc-400"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Grad</label>
                <Input
                  type="text"
                  defaultValue={user?.city}
                  className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500 disabled:border-zinc-700 disabled:bg-zinc-900/60 disabled:text-zinc-400"
                />
              </div>
            </div>
          </div>

          <Button variant="secondary" type="submit" className="w-full cursor-pointer">
            Sačuvaj izmene
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
