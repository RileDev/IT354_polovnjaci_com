import { Button } from "../components/ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import {useAuthStore} from "../stores/authStore.ts";
import {Input} from "../components/ui/input.tsx";
import {type FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { api } from "../services/firebase_api.ts";

const UserProfilePage = () => {
  const { user, token, setUser } = useAuthStore()
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if(!user)
      navigate("/")
  }, [navigate, user])

  useEffect(() => {
    setName(user?.name ?? "");
    setPhoneNum(user?.phoneNum ?? "");
    setCity(user?.city ?? "");
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true);
    setError("");
    setSuccess("");
    if (!user?.uid || !token) {
      setError("Korisnik nije prijavljen.");
      setLoading(false);
      return;
    }

    const payload = {
      name: name || user.name,
      phoneNum: phoneNum || user.phoneNum,
      city: city || user.city
    }

    try {
      await api.patch(`users/${user.uid}`, payload, token);
      const updated = await api.get<typeof user>(`users/${user.uid}`, token);
      setUser(updated ? { ...user, ...updated } : { ...user, ...payload });
      setSuccess("Izmene su sacuvane.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Doslo je do greske.");
    } finally {
      setLoading(false);
    }
  }

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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-lg rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg p-6">
            <h2 className="mb-4 font-semibold">Lični podaci</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Ime i prezime</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500 disabled:border-zinc-700 disabled:bg-zinc-900/60 disabled:text-zinc-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Korisničko ime</label>
                <Input
                  type="text"
                  value={user?.username ?? ""}
                  disabled
                  className="border-zinc-700 bg-zinc-900/60 text-zinc-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="border-zinc-700 bg-zinc-900/60 text-zinc-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Broj telefona</label>
                <Input
                  type="tel"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500 disabled:border-zinc-700 disabled:bg-zinc-900/60 disabled:text-zinc-400"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Grad</label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500 disabled:border-zinc-700 disabled:bg-zinc-900/60 disabled:text-zinc-400"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <Button variant="secondary" type="submit" className="w-full cursor-pointer" disabled={loading}>
            Sačuvaj izmene
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
