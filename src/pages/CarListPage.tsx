import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, firebaseMapRecords } from "../services/firebase";
import type { ICar } from "../types";
import { useFiltersStore } from "../stores/filtersStore";
import FiltersPanel from "../components/homepage/FiltersPanel.tsx";

type CarFilters = {
  brand?: string;
  model?: string;
  fuel?: string;
  bodyType?: string;
  yearFrom?: number;
};

const normalizeParam = (value: string | null) => {
  if (!value || value === "__all__") return undefined;
  return value;
};

const CarListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<ICar[]>([]);
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
    setSelectedBrand,
    setSelectedModel,
    setSelectedFuel,
    setSelectedBodyType,
    setYearFrom,
    getFilters,
  } = useFiltersStore();

  const filters = useMemo<CarFilters>(() => {
    const yearParam = searchParams.get("yearFrom");
    const yearFrom = yearParam ? Number(yearParam) : undefined;

    return {
      brand: normalizeParam(searchParams.get("brand") ?? searchParams.get("brandId")),
      model: normalizeParam(searchParams.get("model") ?? searchParams.get("modelId")),
      fuel: normalizeParam(searchParams.get("fuel")),
      bodyType: normalizeParam(searchParams.get("bodyType")),
      yearFrom: Number.isFinite(yearFrom) ? yearFrom : undefined,
    };
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadCars = async () => {
      setLoading(true);
      setError(null);

      try {
        const carsData = await api.get<Record<string, ICar> | null>("cars");
        const list = firebaseMapRecords(carsData);
        const filtered = list.filter((car) => {
          if (filters.brand && car.brandId !== filters.brand) return false;
          if (filters.model && car.modelId !== filters.model) return false;
          if (filters.fuel && car.fuel !== filters.fuel) return false;
          if (filters.bodyType && car.bodyType !== filters.bodyType) return false;
          if (filters.yearFrom && car.year < filters.yearFrom) return false;
          return true;
        });

        if (!cancelled) setCars(filtered);
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
  }, [filters.brand, filters.model, filters.fuel, filters.bodyType, filters.yearFrom]);

  useEffect(() => {
    let cancelled = false;

    const loadFilterData = async () => {
      if (brands.length && models.length && fuels.length && bodyTypes.length) return;
      try {
        const [brandsData, modelsData, fuelsData, bodyTypesData] = await Promise.all([
          api.get<Record<string, { _id?: string; name: string }> | null>("brands"),
          api.get<Record<string, { _id?: string; name: string; brandId: string }> | null>("models"),
          api.get<Record<string, { _id?: string; name: string }> | null>("fuels"),
          api.get<Record<string, { _id?: string; name: string }> | null>("bodytypes"),
        ]);

        if (cancelled) return;
        setBrands(firebaseMapRecords(brandsData));
        setModels(firebaseMapRecords(modelsData));
        setFuels(firebaseMapRecords(fuelsData));
        setBodyTypes(firebaseMapRecords(bodyTypesData));
      } catch {
        // Silent fail: filters will fall back to ids if metadata fails.
      }
    };

    void loadFilterData();
    return () => {
      cancelled = true;
    };
  }, [brands.length, models.length, fuels.length, bodyTypes.length, setBodyTypes, setBrands, setFuels, setModels]);

  useEffect(() => {
    // Keep the FiltersPanel selections in sync with URL params.
    setSelectedBrand(filters.brand ?? "");
    setSelectedModel(filters.model ?? "");
    setSelectedFuel(filters.fuel ?? "");
    setSelectedBodyType(filters.bodyType ?? "");
    setYearFrom(filters.yearFrom ? String(filters.yearFrom) : "");
  }, [
    filters.brand,
    filters.model,
    filters.fuel,
    filters.bodyType,
    filters.yearFrom,
    setSelectedBodyType,
    setSelectedBrand,
    setSelectedFuel,
    setSelectedModel,
    setYearFrom,
  ]);

  const handleSearch = () => {
    const nextFilters = getFilters();
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    setSearchParams(params, { replace: true });
  };

  const getBrandName = (brandId?: string) =>
    brandId ? brands.find((brand) => brand._id === brandId)?.name ?? brandId : "";
  const getModelName = (modelId?: string) =>
    modelId ? models.find((model) => model._id === modelId)?.name ?? modelId : "";
  const getFuelName = (fuelId?: string) =>
    fuelId ? fuels.find((fuel) => fuel._id === fuelId)?.name ?? fuelId : "";
  const getBodyTypeName = (bodyTypeId?: string) =>
    bodyTypeId ? bodyTypes.find((bodyType) => bodyType._id === bodyTypeId)?.name ?? bodyTypeId : "";

  const activeFilters = [
    filters.brand ? { label: "Marka", value: getBrandName(filters.brand) } : null,
    filters.model ? { label: "Model", value: getModelName(filters.model) } : null,
    filters.fuel ? { label: "Gorivo", value: getFuelName(filters.fuel) } : null,
    filters.bodyType ? { label: "Karoserija", value: getBodyTypeName(filters.bodyType) } : null,
    filters.yearFrom ? { label: "Godiste od", value: String(filters.yearFrom) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Svi oglasi</h1>

      <FiltersPanel onHandleSearch={handleSearch} />

      <div className="mb-6 flex flex-wrap gap-2">
        {activeFilters.length === 0 ? (
          <span className="rounded-full bg-muted/30 px-3 py-1 text-sm text-muted-foreground">
            Nema aktivnih filtera
          </span>
        ) : (
          activeFilters.map((filter) => (
            <span
              key={`${filter.label}-${filter.value}`}
              className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {filter.label}: {filter.value}
            </span>
          ))
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : cars.length === 0 ? (
        <p className="text-muted-foreground">Nema oglasa za izabrane filtere.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <Link
              key={car._id}
              to={`/oglas/${car._id}`}
              className="group overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="aspect-video w-full overflow-hidden bg-zinc-900">
                {car.images?.[0] ? (
                  <img
                    src={car.images[0]}
                    alt={car.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <div className="p-4">
                <h2 className="line-clamp-1 text-lg font-semibold group-hover:text-blue-500">
                  {car.title}
                </h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-blue-500">
                    {car.price.toLocaleString("de-DE")}
                  </span>
                  <span className="text-sm font-medium text-zinc-400">
                    {car.currency}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-1">
                    <span>{car.year}. god.</span>
                  </div>
                  <div className="flex items-center gap-1 text-right justify-end">
                    <span>{car.mileage.toLocaleString("de-DE")} km</span>
                  </div>
                  <div className="flex items-center gap-1 col-span-2 text-zinc-500">
                    <span>
                      {getBrandName(car.brandId)} {getModelName(car.modelId)}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{getFuelName(car.fuel)}</span>
                    <span className="mx-1">•</span>
                    <span>{getBodyTypeName(car.bodyType)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarListPage;
