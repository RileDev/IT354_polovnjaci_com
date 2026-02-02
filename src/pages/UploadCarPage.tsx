import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef, useState } from "react";
import {api, firebaseMapRecords} from "../services/firebase_api.ts";
import type {IBodyType, IBrand, IFuel, IModel} from "../types";
import Dropzone from "react-dropzone";
import {useAuthStore} from "../stores/authStore.ts";

const UploadCarPage = () => {
  const {token} = useAuthStore()
  const [brands, setBrands] = useState<IBrand[]>([])
  const [models, setModels] = useState<IModel[]>([])
  const [fuels, setFuels] = useState<IFuel[]>([])
  const [bodyTypes, setBodyTypes] = useState<IBodyType[]>([])
  const [form, setForm] = useState({
    brandId: "",
    modelId: "",
    title: "",
    year: "",
    fuel: "",
    bodyType: "",
    mileage: "",
    enginePower: "",
    engineDisplacement: "",
    owners: "",
    price: "",
    currency: "EUR",
    description: "",
    features: {
      isCredit: false,
      isLeasing: false,
      hasWarranty: false,
    },
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const dragIndexRef = useRef<number | null>(null)

  useEffect(()=>{
    const loadFilterData = async () => {
      try {
        const [brandsData, modelsData, fuelsData, bodyTypesData] = await Promise.all([
          api.get<Record<string, IBrand> | null>("brands"),
          api.get<Record<string, IModel> | null>("models"),
          api.get<Record<string, IFuel> | null>("fuels"),
          api.get<Record<string, IBodyType> | null>("bodytypes"),
        ]);

        setBrands(firebaseMapRecords(brandsData));
        setModels(firebaseMapRecords(modelsData));
        setFuels(firebaseMapRecords(fuelsData));
        setBodyTypes(firebaseMapRecords(bodyTypesData));
      } catch {
        // No-op: keep empty lists if load fails.
      }
    }

    void loadFilterData();
  }, [])

  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const filteredModels = form.brandId
    ? models.filter((model) => model.brandId === form.brandId)
    : models;

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setImageFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return prev;
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault()
    if(Object.values(form).some(i => i.length == 0) || imageFiles.length === 0) {
      alert("Sva polja moraju biti uneta uključujući i slike!!!")
      return
    }

    // await api.post("cars", {
    //   ...form,
    //   images: imageFiles.map(({path}) => path)
    // }, token)

    console.log({
      ...form,
      images: imageFiles.map(({path}) => path)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Postavi novi oglas</h1>

      <form className="mx-auto max-w-2xl space-y-6" onSubmit={handleFormSubmit}>
        {/* Basic Info */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-lg">
          <h2 className="mb-4 font-semibold">Osnovne informacije</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Marka</label>
              <Select
                value={form.brandId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, brandId: value, modelId: "" }))
                }
              >
                <SelectTrigger className="border-zinc-600 bg-zinc-900 text-sm">
                  <SelectValue placeholder="Izaberite marku" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Model</label>
              <Select
                disabled={!form.brandId}
                value={form.modelId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, modelId: value }))
                }
              >
                <SelectTrigger className="border-zinc-600 bg-zinc-900 text-sm">
                  <SelectValue placeholder="Izaberite model" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModels.map((model) => (
                    <SelectItem key={model._id} value={model._id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Naslov oglasa</label>
              <Input
                type="text"
                placeholder="npr. Audi A4 2.0 TDI S-line"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Godina proizvodnje</label>
              <Input
                type="number"
                placeholder="2019"
                value={form.year}
                onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-lg">
          <h2 className="mb-4 font-semibold">Tehničke karakteristike</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Gorivo</label>
              <Select
                value={form.fuel}
                onValueChange={(value) => setForm((prev) => ({ ...prev, fuel: value }))}
              >
                <SelectTrigger className="border-zinc-600 bg-zinc-900 text-sm">
                  <SelectValue placeholder="Izaberite gorivo" />
                </SelectTrigger>
                <SelectContent>
                  {fuels.map((fuel) => (
                    <SelectItem key={fuel._id} value={fuel._id}>
                      {fuel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Karoserija</label>
              <Select
                value={form.bodyType}
                onValueChange={(value) => setForm((prev) => ({ ...prev, bodyType: value }))}
              >
                <SelectTrigger className="border-zinc-600 bg-zinc-900 text-sm">
                  <SelectValue placeholder="Izaberite tip" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((bodyType) => (
                    <SelectItem key={bodyType._id} value={bodyType._id}>
                      {bodyType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Kilometraža</label>
              <Input
                type="number"
                placeholder="155000"
                value={form.mileage}
                onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Snaga motora (KS)</label>
              <Input
                type="number"
                placeholder="150"
                value={form.enginePower}
                onChange={(e) => setForm((prev) => ({ ...prev, enginePower: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Kubikaža (ccm)</label>
              <Input
                type="number"
                placeholder="1968"
                value={form.engineDisplacement}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, engineDisplacement: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Broj vlasnika</label>
              <Input
                type="number"
                placeholder="1"
                value={form.owners}
                onChange={(e) => setForm((prev) => ({ ...prev, owners: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-lg">
          <h2 className="mb-4 font-semibold">Cena</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Cena</label>
              <Input
                type="number"
                placeholder="18500"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Valuta</label>
              <Select
                value={form.currency}
                onValueChange={(value) => setForm((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="border-zinc-600 bg-zinc-900 text-sm">
                  <SelectValue placeholder="Izaberite valutu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="RSD">RSD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-lg">
          <h2 className="mb-4 font-semibold">Opis</h2>
          <textarea
            rows={5}
            placeholder="Opišite vaš automobil..."
            className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {/* Features */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-lg">
          <h2 className="mb-4 font-semibold">Dodatne opcije</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={form.features.isCredit}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    features: { ...prev.features, isCredit: checked === true },
                  }))
                }
              />
              <span className="text-sm">Moguć kredit</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={form.features.isLeasing}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    features: { ...prev.features, isLeasing: checked === true },
                  }))
                }
              />
              <span className="text-sm">Moguć lizing</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={form.features.hasWarranty}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    features: { ...prev.features, hasWarranty: checked === true },
                  }))
                }
              />
              <span className="text-sm">Garancija</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-lg">
          <h2 className="mb-4 font-semibold">Slike</h2>
          <Dropzone
            accept={{
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
            }}
            multiple
            onDrop={(acceptedFiles, _fileRejections, event) => {
              if (event?.dataTransfer?.types?.includes("text/polovnjaci-reorder")) {
                return;
              }
              if (acceptedFiles.length === 0) return;
              setImageFiles((prev) => [...prev, ...acceptedFiles]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({
                  className:
                    "rounded-lg border-2 border-dashed border-zinc-700 p-8 text-center",
                })}
              >
                <input {...getInputProps()} />
                {imagePreviews.length === 0 ? (
                  <p className="text-zinc-400">
                    Prevucite slike ovde ili kliknite za izbor
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {imagePreviews.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="group relative aspect-video overflow-hidden rounded-md border border-zinc-700 bg-zinc-900"
                        draggable
                        onDragStart={(e) => {
                          dragIndexRef.current = index;
                          e.dataTransfer.setData("text/polovnjaci-reorder", "1");
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const fromIndex = dragIndexRef.current;
                          if (fromIndex === null) return;
                          handleReorder(fromIndex, index);
                          dragIndexRef.current = null;
                        }}
                        onDragEnd={() => {
                          dragIndexRef.current = null;
                        }}
                      >
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                        >
                          Ukloni
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        <Button variant="secondary" type="submit" className="w-full cursor-pointer" size="lg">
          Objavi oglas
        </Button>
      </form>
    </div>
  );
};

export default UploadCarPage;
