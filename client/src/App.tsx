import { Routes, Route } from "react-router-dom";
import { Home as HomePage } from "./pages/Home";
import { Missions as MissionsPage } from "./pages/Missions";
import { Weather as WeatherPage } from "./pages/Weather";
import { Preferences as PreferencesPage } from "./pages/Preferences";
import { _404 } from "./pages/_404";
import { HelmetProvider, Helmet } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{process.env.REACT_APP_TITLE}</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/Preferences" element={<PreferencesPage />} />
        <Route path="*" element={<_404 />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
