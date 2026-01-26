import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CarFront,
  Fuel,
  Gauge,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { api, firebaseMapRecords } from "../services/firebase";
import { useFiltersStore } from "../stores/filtersStore";
import type {
  IBodyType,
  IBrand,
  ICar,
  IFuel,
  IModel,
  IUser,
} from "../types";

const CarDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [car, setCar] = useState<ICar | null>(null);
  const [seller, setSeller] = useState<IUser | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    brands,
    models,
    fuels,
    bodyTypes,
    setBrands,
    setModels,
    setFuels,
    setBodyTypes,
  } = useFiltersStore();

  useEffect(() => {
    let cancelled = false;

    const loadCar = async () => {
      if (!id) {
        setError("Oglas nije pronadjen.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const carsData = await api.get<Record<string, ICar> | null>("cars");
        const list = firebaseMapRecords(carsData);
        const found = list.find((item) => item._id === id) ?? null;

        if (cancelled) return;
        setCar(found);

        if (!found) {
          setError("Oglas nije pronadjen.");
          return;
        }

        const usersData = await api.get<Record<string, IUser> | null>("users");
        const users = firebaseMapRecords(usersData);
        const foundSeller = users.find((user) => user._id === found.sellerId) ?? null;

        if (!cancelled) setSeller(foundSeller);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Neuspesno ucitavanje oglasa.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadCar();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    // Reset gallery selection when a new car loads.
    setSelectedImage(0);
  }, [car?._id]);

  useEffect(() => {
    let cancelled = false;

    const loadFilterData = async () => {
      if (brands.length && models.length && fuels.length && bodyTypes.length) return;
      try {
        const [brandsData, modelsData, fuelsData, bodyTypesData] = await Promise.all([
          api.get<Record<string, IBrand> | null>("brands"),
          api.get<Record<string, IModel> | null>("models"),
          api.get<Record<string, IFuel> | null>("fuels"),
          api.get<Record<string, IBodyType> | null>("bodytypes"),
        ]);

        if (cancelled) return;
        setBrands(firebaseMapRecords(brandsData));
        setModels(firebaseMapRecords(modelsData));
        setFuels(firebaseMapRecords(fuelsData));
        setBodyTypes(firebaseMapRecords(bodyTypesData));
      } catch {
        // Silent fail: UI will fall back to ids.
      }
    };

    void loadFilterData();
    return () => {
      cancelled = true;
    };
  }, [
    bodyTypes.length,
    brands.length,
    fuels.length,
    models.length,
    setBodyTypes,
    setBrands,
    setFuels,
    setModels,
  ]);

  const brandMap = useMemo(() => new Map(brands.map((b) => [b._id, b.name])), [brands]);
  const modelMap = useMemo(() => new Map(models.map((m) => [m._id, m.name])), [models]);
  const fuelMap = useMemo(() => new Map(fuels.map((f) => [f._id, f.name])), [fuels]);
  const bodyTypeMap = useMemo(
    () => new Map(bodyTypes.map((b) => [b._id, b.name])),
    [bodyTypes],
  );

  const getName = (idValue: string | undefined, map: Map<string, string>) =>
    idValue ? map.get(idValue) ?? idValue : "";

  const brandName = car ? getName(car.brandId, brandMap) : "";
  const modelName = car ? getName(car.modelId, modelMap) : "";

  const images = car?.images?.length ? car.images : [""];
  const mainImage = images[selectedImage] || images[0] || "";

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-video rounded-lg bg-zinc-800 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-zinc-800 animate-pulse" />
            <div className="h-6 w-1/2 rounded bg-zinc-800 animate-pulse" />
            <div className="h-24 rounded bg-zinc-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error || "Oglas nije pronadjen."}</h1>
        <Button className="mt-4 gap-2 cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Nazad
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="gap-2 cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Nazad
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
            {mainImage ? (
              <img
                src={mainImage}
                alt={car.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="h-full w-full bg-zinc-800" />
            )}
          </div>

          {images.length > 1 && images[0] && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-video overflow-hidden rounded-md border-2 transition-all ${
                    i === selectedImage
                      ? "border-blue-500"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${car.title} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{car.title}</h1>
            <div className="mt-2 text-2xl font-bold text-blue-500">
              {car.price.toLocaleString("de-DE")} {car.currency}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div className="mb-1 flex items-center gap-2 text-zinc-400">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Godiste</span>
              </div>
              <p className="font-semibold">{car.year}.</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div className="mb-1 flex items-center gap-2 text-zinc-400">
                <Gauge className="h-4 w-4" />
                <span className="text-xs">Kilometraza</span>
              </div>
              <p className="font-semibold">{car.mileage.toLocaleString("de-DE")} km</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div className="mb-1 flex items-center gap-2 text-zinc-400">
                <Fuel className="h-4 w-4" />
                <span className="text-xs">Gorivo</span>
              </div>
              <p className="font-semibold">{getName(car.fuel, fuelMap)}</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div className="mb-1 flex items-center gap-2 text-zinc-400">
                <CarFront className="h-4 w-4" />
                <span className="text-xs">Karoserija</span>
              </div>
              <p className="font-semibold">{getName(car.bodyType, bodyTypeMap)}</p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
            <h3 className="mb-4 font-semibold">Tehnicki podaci</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-zinc-700 pb-2">
                <span className="text-zinc-400">Marka</span>
                <span>{brandName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-700 pb-2">
                <span className="text-zinc-400">Model</span>
                <span>{modelName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-700 pb-2">
                <span className="text-zinc-400">Kubikaza</span>
                <span>{car.engineDisplacement} cm3</span>
              </div>
              <div className="flex justify-between border-b border-zinc-700 pb-2">
                <span className="text-zinc-400">Snaga motora</span>
                <span>{car.engineType} KS</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-zinc-400">Broj vlasnika</span>
                <span>{car.noOwners}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
            <h3 className="mb-4 text-lg font-semibold">Kontakt prodavca</h3>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                {(seller?.name ?? "P").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{seller?.name ?? "Prodavac"}</p>
                <div className="flex items-center gap-1 text-sm text-zinc-400">
                  <MapPin className="h-3 w-3" />
                  <span>{seller?.city ?? "Nepoznato"}</span>
                </div>
              </div>
            </div>

                <a href={seller?.phoneNum ? `tel:${seller.phoneNum}` : undefined}>
                    <Button className="h-12 w-full gap-2 text-lg cursor-pointer" disabled={!seller?.phoneNum}>
                    <Phone className="h-5 w-5" />
                    {seller?.phoneNum ?? "Telefon nije dostupan"}
                    </Button>
                </a>

          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Opis oglasa</h2>
        <div className="whitespace-pre-wrap rounded-lg border border-zinc-700 bg-zinc-800 p-6 leading-relaxed text-zinc-300">
          {car.description || "Nema opisa."}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Dodatne informacije</h2>
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${car.features?.isCredit ? "bg-green-500" : "bg-red-500"}`} />
              <span className={car.features?.isCredit ? "text-zinc-200" : "text-zinc-500"}>
                Moguc kredit
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${car.features?.isLeasing ? "bg-green-500" : "bg-red-500"}`} />
              <span className={car.features?.isLeasing ? "text-zinc-200" : "text-zinc-500"}>
                Moguc lizing
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${car.features?.hasWarranty ? "bg-green-500" : "bg-red-500"}`} />
              <span className={car.features?.hasWarranty ? "text-zinc-200" : "text-zinc-500"}>
                Garancija
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
