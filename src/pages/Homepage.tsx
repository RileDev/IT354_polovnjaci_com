import { useEffect } from "react";
import FiltersPanel from "../components/homepage/FiltersPanel.tsx";
import LatestAds from "../components/homepage/LatestAds.tsx";
import {api, firebaseMapRecords} from "../services/firebase_api.ts";
import { useCarsStore } from "../stores/carsStore";
import { useFiltersStore } from "../stores/filtersStore";
import type { IBodyType, IBrand, ICar, IFuel, IModel } from "../types";
import {useNavigate} from "react-router";

const Homepage = () => {
    const navigate = useNavigate()
  const { setBrands, setModels, setFuels, setBodyTypes, getFilters } = useFiltersStore();
  const { setCars, setLoading } = useCarsStore();

  useEffect(() => {
      (async () => {
      try {
        const [brandsData, modelsData, fuelsData, bodyTypesData] =
          await Promise.all([
            api.get<Record<string, IBrand> | null>("brands"),
            api.get<Record<string, IModel> | null>("models"),
            api.get<Record<string, IFuel> | null>("fuels"),
            api.get<Record<string, IBodyType> | null>("bodytypes"),
          ]);

        setBrands(firebaseMapRecords(brandsData));
        setModels(firebaseMapRecords(modelsData));
        setFuels(firebaseMapRecords(fuelsData));
        setBodyTypes(firebaseMapRecords(bodyTypesData));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [setBodyTypes, setBrands, setFuels, setModels]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const carsData = await api.get<Record<string, ICar> | null>("cars");
        setCars(firebaseMapRecords(carsData));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [setCars, setLoading]);

  const handleSearch = () => {
      const filters = getFilters()
      const params = new URLSearchParams()
      Object.entries(filters).map(([key, value]) =>
      {
          params.append(key, String(value))
      })

      navigate(`/oglasi?${params.toString()}`)
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
