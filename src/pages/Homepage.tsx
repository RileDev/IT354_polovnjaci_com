import { useEffect, useState } from "react";
import FiltersPanel from "../components/FiltersPanel.tsx";
import { api } from "../services/firebase.ts";
import { useFiltersStore } from "../stores/filtersStore";
import type { IBodyType, IBrand, ICar, IFuel, IModel } from "../types";

const Homepage = () => {
  const { setBrands, setModels, setFuels, setBodyTypes, getFilters } = useFiltersStore();

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

  const handleSearch = () => {
      console.log(getFilters())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Pronadjite savrsen automobil</h1>
      <FiltersPanel onHandleSearch={handleSearch}/>
    </div>
  );
};

export default Homepage;
