import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full rounded-2xl border border-slate-700 bg-slate-900 p-8 space-y-5">
        <h1 className="text-4xl font-bold">FHIR Contract Viewer</h1>
        <p className="text-slate-300">
          Explore a sample FHIR <code>Contract</code> resource with summary fields,
          offer terms, and raw JSON.
        </p>

        <div className="flex gap-3">
          <Link
            href="/fhir-contract"
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 transition"
          >
            Open Viewer
          </Link>
          <a
            href="https://build.fhir.org/contract-example-ins-policy.json.html"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-800 transition"
          >
            Source JSON
          </a>
        </div>
      </div>
    </main>
  );
}
