import React from 'react'

const FiltersPanel = () => {
    return (
        <section className="mb-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Pretraga</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                {/* Brand */}
                <select
                    className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value="Brand_Test"
                    onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedModel(""); // Reset model when brand changes
                    }}
                >
                    <option value="">Sve marke</option>
                    {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                            {brand.name}
                        </option>
                    ))}
                </select>

                {/* Model */}
                <select
                    className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                >
                    <option value="">Svi modeli</option>
                    {models.map((model) => (
                        <option key={model._id} value={model._id}>
                            {model.name}
                        </option>
                    ))}
                </select>

                {/* Year From */}
                <select
                    className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                >
                    <option value="">Godište od</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Fuel */}
                <select
                    className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                >
                    <option value="">Gorivo</option>
                    {fuels.map((fuel) => (
                        <option key={fuel._id} value={fuel._id}>
                            {fuel.name}
                        </option>
                    ))}
                </select>

                {/* Body Type */}
                <select
                    className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedBodyType}
                    onChange={(e) => setSelectedBodyType(e.target.value)}
                >
                    <option value="">Karoserija</option>
                    {bodyTypes.map((bt) => (
                        <option key={bt._id} value={bt._id}>
                            {bt.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-4 flex gap-2">
                <Button
                    variant="secondary"
                    onClick={handleClearFilters}
                    className="px-6"
                >
                    Obriši filtere
                </Button>
                <Button onClick={handleSearch} className="px-6">
                    Pretraži
                </Button>
            </div>
        </section>
    )
}
export default FiltersPanel
