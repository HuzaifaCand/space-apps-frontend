export default function FinalPage() {
  return (
    <div className="w-full p-6 bg-background/80 min-h-[30rem] rounded-b-2xl flex flex-col gap-8">
      {/* Page Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-left sm:text-left">
        Data Downloads & Source Information
      </h2>

      {/* First Row: Full JSON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-background/50 p-6 rounded-2xl border border-blueBg">
        <div className="flex-1 text-white">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Full Dataset JSON
          </h3>
          <p className="text-xs sm:text-sm opacity-80 text-muted leading-relaxed">
            Contains data and predictions extracted from the entire dataset
            across all years. Includes statistics, probabilities, and optional
            DataFrame of all calculations.
          </p>
        </div>
        <a
          href="https://web-production-ba201.up.railway.app/full_json/download"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 sm:mt-0 inline-block px-6 py-2 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition"
        >
          Download Full JSON
        </a>
      </div>

      {/* Second Row: Yearly JSON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-bg-background/50 p-6 rounded-2xl border border-blueBg">
        <div className="flex-1 text-white">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Yearly Dataset JSON
          </h3>
          <p className="text-xs sm:text-sm opacity-80 text-muted leading-relaxed">
            Contains data and predictions for each individual year in the
            dataset. Includes yearly statistics, probabilities, and optional
            DataFrame for that year’s calculations only. WIll be used for trend
            plotting and seeing trends.
          </p>
        </div>
        <a
          href="https://web-production-ba201.up.railway.app/yearly_data/download"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 sm:mt-0 inline-block px-6 py-2 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition"
        >
          Download Yearly JSON
        </a>
      </div>

      {/* Third Row: NASA Power API */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-bg-background/50 p-6 rounded-2xl border border-blueBg">
        <div className="flex-1 text-white">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Data Source: NASA Power API
          </h3>
          <p className="text-xs sm:text-sm opacity-80 text-muted leading-relaxed">
            This application uses the NASA Power API for historical climatology
            data. The API provides reliable, comprehensive datasets and is easy
            to use, allowing accurate weather analysis and probability
            calculations.
          </p>
        </div>
        <a
          href="https://power.larc.nasa.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 sm:mt-0 inline-block px-6 py-2 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition"
        >
          Visit NASA Power API
        </a>
      </div>
    </div>
  );
}
