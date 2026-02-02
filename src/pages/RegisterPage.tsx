import {useMemo, useState, type FormEvent, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input";
import { auth } from "../services/firebase";
import { api } from "../services/firebase_api";
import {useAuthStore} from "../stores/authStore.ts";

const RegisterPage = () => {
  const {user} = useAuthStore()
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if(user)
      navigate("/")
  }, [navigate, user])

  const markTouched = (field: string) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const fieldErrors = useMemo(
    () => ({
      name: name.trim() ? "" : "Unesite ime i prezime.",
      username: username.trim() ? "" : "Unesite korisnicko ime.",
      email: email.trim() ? "" : "Unesite email adresu.",
      password:
        password.length >= 6 ? "" : "Lozinka mora imati najmanje 6 karaktera.",
    }),
    [name, username, email, password],
  );

  const shouldShowError = (field: keyof typeof fieldErrors) =>
    (submitted || touched[field]) && fieldErrors[field];

  const getAuthErrorMessage = (err: unknown) => {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/email-already-in-use":
          return "Email adresa je vec u upotrebi.";
        case "auth/invalid-email":
          return "Email adresa nije validna.";
        case "auth/weak-password":
          return "Lozinka je prekratka. Koristite najmanje 6 karaktera.";
        case "auth/operation-not-allowed":
          return "Email/lozinka autentikacija nije omogucena.";
        case "auth/popup-closed-by-user":
          return "Popup je zatvoren pre zavrsetka prijave.";
        case "auth/account-exists-with-different-credential":
          return "Nalog vec postoji sa drugim nacinom prijave.";
        case "auth/network-request-failed":
          return "Problem sa mrezom. Pokusajte ponovo.";
        default:
          return "Doslo je do greske prilikom registracije.";
      }
    }

    if (err instanceof Error) {
      return err.message;
    }

    return "Doslo je do greske prilikom registracije.";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(true);

    if (Object.values(fieldErrors).some(Boolean)) {
      setLoading(false);
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      if (name || username) {
        await updateProfile(credential.user, {
          displayName: name || username,
        });
      }

      const payload = {
        uid: credential.user.uid,
        name: name || username,
        username,
        email,
        ...(phoneNum ? { phoneNum } : {}),
        ...(city ? { city } : {}),
        avatar: credential.user.photoURL ?? "",
        role: "user" as const,
        createdAt: new Date().toISOString(),
      };

      const token = await credential.user.getIdToken();
      await api.put(`users/${credential.user.uid}`, payload, token);
      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const ensureUserProfile = async (uid: string, token: string, profile: {
    name: string;
    username: string;
    email: string;
    avatar?: string;
  }) => {
    const existing = await api.get<Record<string, unknown> | null>(`users/${uid}`, token);
    if (!existing) {
      await api.put(
        `users/${uid}`,
        {
          uid,
          ...profile,
          role: "user",
          createdAt: new Date().toISOString(),
        },
        token,
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const emailValue = result.user.email ?? "";
      const fallbackUsername = emailValue ? emailValue.split("@")[0] : "korisnik";

      await ensureUserProfile(result.user.uid, token, {
        name: result.user.displayName ?? "Korisnik",
        username: result.user.displayName ?? fallbackUsername,
        email: emailValue,
        avatar: result.user.photoURL ?? "",
      });

      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Registracija</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Ime i prezime
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Marko Markovic"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={markTouched("name")}
              aria-invalid={Boolean(shouldShowError("name"))}
              required
            />
            {shouldShowError("name") && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium">
              Korisnicko ime
            </label>
            <Input
              id="username"
              type="text"
              placeholder="marko123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={markTouched("username")}
              aria-invalid={Boolean(shouldShowError("username"))}
              required
            />
            {shouldShowError("username") && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email adresa
            </label>
            <Input
              id="email"
              type="email"
              placeholder="vasa@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={markTouched("email")}
              aria-invalid={Boolean(shouldShowError("email"))}
              required
            />
            {shouldShowError("email") && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Lozinka
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={markTouched("password")}
              aria-invalid={Boolean(shouldShowError("password"))}
              required
            />
            {shouldShowError("password") && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNum" className="mb-1 block text-sm font-medium">
              Broj telefona (opciono)
            </label>
            <Input
              id="phoneNum"
              type="tel"
              placeholder="+381 60 123 4567"
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium">
              Grad (opciono)
            </label>
            <Input
              id="city"
              type="text"
              placeholder="Beograd"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Registracija..." : "Registrujte se"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-zinc-700" />
          <span className="text-sm text-zinc-400">ili</span>
          <div className="h-px flex-1 bg-zinc-700" />
        </div>

        <Button
          variant="secondary"
          className="w-full cursor-pointer"
          disabled={loading}
          onClick={handleGoogleSignIn}
          type="button"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Registracija sa Google nalogom
        </Button>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Vec imate nalog?{" "}
          <Link to="/prijava" className="text-blue-500 hover:underline">
            Prijavite se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
