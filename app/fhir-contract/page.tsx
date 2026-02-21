"use client";

import { useEffect, useMemo, useState } from "react";

type FhirContract = Record<string, any>;

function getOfferTexts(node: any, out: string[] = []) {
  if (!node || typeof node !== "object") return out;
  if (node.offer?.text) out.push(node.offer.text);
  if (Array.isArray(node.group)) node.group.forEach((g) => getOfferTexts(g, out));
  if (Array.isArray(node.term)) node.term.forEach((t) => getOfferTexts(t, out));
  return out;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-slate-100">{value || "N/A"}</p>
    </div>
  );
}

export default function FhirContractPage() {
  const [data, setData] = useState<FhirContract | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/contract.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  const offerTexts = useMemo(() => (data ? getOfferTexts(data) : []), [data]);

  if (error) {
    return <main className="p-8 text-red-400">Error: {error}</main>;
  }

  if (!data) {
    return <main className="p-8 text-slate-300">Loading FHIR Contract...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h1 className="text-3xl font-bold">FHIR Contract Viewer</h1>
          <p className="mt-2 text-slate-300">
            Resource: <span className="font-semibold">{data.resourceType || "Contract"}</span>
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <Field label="Contract ID" value={data.id ?? ""} />
          <Field label="Identifier" value={data.identifier?.[0]?.value ?? ""} />
          <Field label="Status" value={data.status ?? ""} />
          <Field label="Issued" value={data.issued ?? ""} />
          <Field label="Applies Start" value={data.applies?.start ?? ""} />
          <Field label="Applies End" value={data.applies?.end ?? ""} />
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Offer Terms</h2>
          {offerTexts.length === 0 ? (
            <p className="mt-3 text-slate-400">No offer text found.</p>
          ) : (
            <div className="mt-3 overflow-auto rounded-lg border border-slate-700">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 w-20">#</th>
                    <th className="px-4 py-3">Term Text</th>
                  </tr>
                </thead>
                <tbody>
                  {offerTexts.map((text, i) => (
                    <tr key={`${i}-${text.slice(0, 20)}`} className="border-t border-slate-800">
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3">{text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Raw JSON</h2>
          <pre className="mt-3 max-h-[420px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-200">
            {JSON.stringify(data, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
