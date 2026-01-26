import { Link } from "react-router-dom";
import { useCarsStore } from "../stores/carsStore";
import { useFiltersStore } from "../stores/filtersStore";

const LatestAds = () => {
  const LIMIT = 8;

  const { cars, loading } = useCarsStore();
  const { brands, models, fuels, bodyTypes } = useFiltersStore();

  const getBrandName = (brandId: string) =>
    brands.find((brand) => brand._id === brandId)?.name ?? "";

  const getModelName = (modelId: string) =>
    models.find((model) => model._id === modelId)?.name ?? "";

  const sortedCars = [...cars].sort((a, b) => {
    const aTime = Date.parse(a.createdAt ?? "") || 0;
    const bTime = Date.parse(b.createdAt ?? "") || 0;
    return bTime - aTime;
  });

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Najnoviji oglasi</h2>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[340px] rounded-lg border border-zinc-700 bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : sortedCars.length === 0 ? (
        <p className="text-zinc-400">Trenutno nema aktivnih oglasa.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedCars.slice(0, LIMIT).map((car) => (
            <Link
              key={car._id}
              to={`/oglas/${car._id}`}
              className="group overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-lg font-semibold group-hover:text-blue-500">
                  {car.title}
                </h3>
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
                    <span>{fuels.find((f) => f._id === car.fuel)?.name}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {bodyTypes.find((b) => b._id === car.bodyType)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default LatestAds;
