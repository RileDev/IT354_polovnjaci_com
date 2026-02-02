import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const MyAdsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Moji oglasi</h1>
        <Button variant="secondary" asChild>
          <Link to="/postavi-oglas">+ Novi oglas</Link>
        </Button>
      </div>

      {/* Ads List */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow-lg sm:flex-row"
          >
            {/* Image */}
            <div className="h-24 w-full shrink-0 rounded-md bg-zinc-700/50 animate-pulse sm:w-32" />

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between gap-3">
              <div>
                <h3 className="font-semibold">Ucitavanje...</h3>
                <p className="text-sm text-zinc-400">
                  Godina: ---- | Kilometraza: --- km
                </p>
              </div>
              <p className="text-lg font-bold text-blue-400">EUR --,---</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 sm:flex-col">
              <Button
                variant="outline"
                size="icon"
                className="border-zinc-600 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-zinc-600 bg-zinc-900 text-red-400 hover:bg-zinc-800 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="mt-8 hidden rounded-lg border border-dashed border-zinc-700 p-8 text-center">
        <p className="text-zinc-400">
          Nemate nijedan oglas. Postavite vas prvi oglas!
        </p>
        <Button variant="secondary" asChild className="mt-4">
          <Link to="/postavi-oglas">Postavi oglas</Link>
        </Button>
      </div>
    </div>
  );
};

export default MyAdsPage;
