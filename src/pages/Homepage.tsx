import { useEffect } from "react";
import FiltersPanel from "../components/FiltersPanel.tsx";
import LatestAds from "../components/LatestAds";
import { api } from "../services/firebase.ts";
import { useCarsStore } from "../stores/carsStore";
import { useFiltersStore } from "../stores/filtersStore";
import type { IBodyType, IBrand, ICar, IFuel, IModel } from "../types";

const Homepage = () => {
  const { setBrands, setModels, setFuels, setBodyTypes, getFilters } = useFiltersStore();
  const { setCars, setLoading } = useCarsStore();

  useEffect(() => {
    const mapRecords = <T extends { _id?: string }>(
      data: Record<string, T> | null
    ) =>
      data
        ? Object.entries(data).map(([id, item]) => ({
            ...item,
            _id: item._id ?? id,
          }))
        : [];

    (async () => {
      try {
        const [brandsData, modelsData, fuelsData, bodyTypesData] =
          await Promise.all([
            api.get<Record<string, IBrand> | null>("brands"),
            api.get<Record<string, IModel> | null>("models"),
            api.get<Record<string, IFuel> | null>("fuels"),
            api.get<Record<string, IBodyType> | null>("bodyTypes"),
          ]);

        setBrands(mapRecords(brandsData));
        setModels(mapRecords(modelsData));
        setFuels(mapRecords(fuelsData));
        setBodyTypes(mapRecords(bodyTypesData));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [setBodyTypes, setBrands, setFuels, setModels]);

  useEffect(() => {
    const mapRecords = <T extends { _id?: string }>(
      data: Record<string, T> | null
    ) =>
      data
        ? Object.entries(data).map(([id, item]) => ({
            ...item,
            _id: item._id ?? id,
          }))
        : [];

    (async () => {
      setLoading(true);
      try {
        const carsData = await api.get<Record<string, ICar> | null>("cars");
        setCars(mapRecords(carsData));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [setCars, setLoading]);

  const handleSearch = () => {
    console.log(getFilters());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Pronadjite savrsen automobil</h1>
      <FiltersPanel onHandleSearch={handleSearch}/>
      <LatestAds />
    </div>
  );
};

export default Homepage;
