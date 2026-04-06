import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import GamesPage from "./pages/GamesPage"
import SiteNavbar from "./navigation/SiteNavBar";
import GameDetailPage from "./pages/GameDetailPage"

function App() {
  return (
    <HashRouter>
      <SiteNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path='/games' element={<GamesPage />} />
        <Route path="/games/:id" element={<GameDetailPage />} />

      </Routes>
    </HashRouter>
  );
}

export default App;