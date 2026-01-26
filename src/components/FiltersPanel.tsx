import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFiltersStore } from "../stores/filtersStore";

const ALL_VALUE = "__all__";

// @ts-ignore
const FiltersPanel = ({onHandleSearch}) => {
  const {
    brands,
    models,
    fuels,
    bodyTypes,
    years,
    selectedBrand,
    selectedModel,
    selectedFuel,
    selectedBodyType,
    yearFrom,
    setSelectedBrand,
    setSelectedModel,
    setSelectedFuel,
    setSelectedBodyType,
    setYearFrom,
    clearFilters,
  } = useFiltersStore();

  const filteredModels = selectedBrand
    ? models.filter((model) => model.brandId === selectedBrand)
    : models;

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleSelectValue = (value: string) =>
    value === ALL_VALUE ? "" : value;

  return (
    <section className="mb-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Pretraga</h2>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {/* Brand */}
        <Select
          value={selectedBrand || undefined}
          onValueChange={(value) => {
            const nextValue = handleSelectValue(value);
            setSelectedBrand(nextValue);
            setSelectedModel("");
          }}
        >
          <SelectTrigger className="w-full border-zinc-600 bg-zinc-900 text-sm">
            <SelectValue placeholder="Sve marke" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Sve marke</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand._id} value={brand._id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model */}
        <Select
          value={selectedModel || undefined}
          onValueChange={(value) => setSelectedModel(handleSelectValue(value))}
          disabled={!selectedBrand}
        >
          <SelectTrigger className="w-full border-zinc-600 bg-zinc-900 text-sm">
            <SelectValue placeholder="Svi modeli" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Svi modeli</SelectItem>
            {filteredModels.map((model) => (
              <SelectItem key={model._id} value={model._id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year From */}
        <Select
          value={yearFrom || undefined}
          onValueChange={(value) => setYearFrom(handleSelectValue(value))}
        >
          <SelectTrigger className="w-full border-zinc-600 bg-zinc-900 text-sm">
            <SelectValue placeholder="Godiste od" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Godiste od</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Fuel */}
        <Select
          value={selectedFuel || undefined}
          onValueChange={(value) => setSelectedFuel(handleSelectValue(value))}
        >
          <SelectTrigger className="w-full border-zinc-600 bg-zinc-900 text-sm">
            <SelectValue placeholder="Gorivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Gorivo</SelectItem>
            {fuels.map((fuel) => (
              <SelectItem key={fuel._id} value={fuel._id}>
                {fuel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Body Type */}
        <Select
          value={selectedBodyType || undefined}
          onValueChange={(value) =>
            setSelectedBodyType(handleSelectValue(value))
          }
        >
          <SelectTrigger className="w-full border-zinc-600 bg-zinc-900 text-sm">
            <SelectValue placeholder="Karoserija" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Karoserija</SelectItem>
            {bodyTypes.map((bt) => (
              <SelectItem key={bt._id} value={bt._id}>
                {bt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={handleClearFilters} className="px-6 cursor-pointer">
          Obrisi filtere
        </Button>
        <Button onClick={onHandleSearch} className="px-6 cursor-pointer">
          Pretrazi
        </Button>
      </div>
    </section>
  );
};

export default FiltersPanel;
