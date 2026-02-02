import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { api, firebaseMapRecords } from "../services/firebase_api";
import { useAuthStore } from "../stores/authStore";
import type { ICar } from "../types";

const MyAdsPage = () => {
  const { user, token } = useAuthStore();
  const [cars, setCars] = useState<ICar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCars = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const carsData = await api.get<Record<string, ICar> | null>("cars", token ?? undefined);
        const list = firebaseMapRecords(carsData);
        const myCars = list.filter((car) => car.sellerId === user.uid);
        if (!cancelled) setCars(myCars);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Neuspesno ucitavanje oglasa.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadCars();
    return () => {
      cancelled = true;
    };
  }, [token, user]);

  const hasCars = useMemo(() => cars.length > 0, [cars.length]);

  const handleCarDelete = async (carId: string) => {
    if (!carId || !token) return;

    const previous = cars;
    setCars((prev) => prev.filter((car) => car._id !== carId));

    try {
      await api.delete(`cars/${carId}`, token ?? undefined);
    } catch (err) {
      setCars(previous);
      setError(err instanceof Error ? err.message : "Neuspesno brisanje oglasa.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Moji oglasi</h1>
        <Button variant="secondary" asChild>
          <Link to="/postavi-oglas">+ Novi oglas</Link>
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Ads List */}
      <div className="space-y-4">
        {loading && <div className="flex justify-center p-10">Učitavanje...</div>}

        {!loading &&
          cars.map((car) => (
            <div
              key={car._id}
              className="flex flex-col gap-4 rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow-lg sm:flex-row"
            >
              <Link to={`/oglas/${car._id}`} className="flex flex-1 flex-col gap-4 sm:flex-row">
                {/* Image */}
                {car.images?.length ? (
                  <img
                    src={car.images[0]}
                    alt={car.title}
                    className="h-24 w-full shrink-0 rounded-md object-cover sm:w-32"
                  />
                ) : (
                  <div className="h-24 w-full shrink-0 rounded-md bg-zinc-700/50 sm:w-32" />
                )}

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{car.title}</h3>
                    <p className="text-sm text-zinc-400">
                      Godina: {car.year} | Kilometraza: {car.mileage} km
                    </p>
                  </div>
                  <p className="text-lg font-bold text-blue-400">
                    {car.currency} {car.price.toLocaleString("sr-RS")}
                  </p>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex gap-2 sm:flex-col">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-zinc-600 bg-zinc-900 text-red-400 hover:bg-zinc-800 hover:text-red-400 cursor-pointer"
                  onClick={() => handleCarDelete(car._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {!loading && !hasCars && (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-700 p-8 text-center">
          <p className="text-zinc-400">
            Nemate nijedan oglas. Postavite vas prvi oglas!
          </p>
          <Button variant="secondary" asChild className="mt-4">
            <Link to="/postavi-oglas">Postavi oglas</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyAdsPage;
