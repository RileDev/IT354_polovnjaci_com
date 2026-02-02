import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../services/firebase";

const PasswordResetPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAuthErrorMessage = (err: unknown) => {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/invalid-credential":
          return "Trenutna lozinka nije ispravna.";
        case "auth/requires-recent-login":
          return "Potrebna je ponovna prijava. Odjavite se i prijavite ponovo.";
        case "auth/weak-password":
          return "Nova lozinka je preslaba.";
        default:
          return "Doslo je do greske prilikom promene lozinke.";
      }
    }

    if (err instanceof Error) return err.message;

    return "Doslo je do greske prilikom promene lozinke.";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("Morate biti prijavljeni da biste promenili lozinku.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Popunite sva polja.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Nova lozinka i potvrda se ne poklapaju.");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Lozinka je uspesno promenjena.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800 p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold">Resetuj sifru</h1>
        <p className="mb-6 text-center text-sm text-zinc-400">
          Unesite novu lozinku za vas nalog
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-400">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium">
              Trenutna lozinka
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="********"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">
              Nova lozinka
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
              Potvrdite novu lozinku
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Cuvanje..." : "Promeni lozinku"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
