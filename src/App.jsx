import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import { ThemeProvider } from './themes/ThemeContext.jsx';
import Home from './screens/Home.jsx';
import HabitatSelect from './screens/HabitatSelect.jsx';
import Quiz from './screens/Quiz.jsx';
import AnimalReveal from './screens/AnimalReveal.jsx';
import Collection from './screens/Collection.jsx';
import Settings from './screens/Settings.jsx';
import Register from './screens/Register.jsx';
import Login from './screens/Login.jsx';
import Diagnostic from './screens/Diagnostic.jsx';
import MockSATs from './screens/MockSATs.jsx';
import About from './screens/About.jsx';
import AvatarBuilder from './features/avatars/AvatarBuilder.jsx';
import Arcade from './features/arcade/Arcade.jsx';
import WordCatcher from './features/arcade/WordCatcher.jsx';
import BubblePop from './features/arcade/BubblePop.jsx';
import SpeedSpell from './features/arcade/SpeedSpell.jsx';
import MemoryMatch from './features/arcade/MemoryMatch.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/habitats" element={<HabitatSelect />} />
          <Route path="/quiz/:habitatId" element={<Quiz />} />
          <Route path="/reveal/:habitatId" element={<AnimalReveal />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/mock-sats" element={<MockSATs />} />
          <Route path="/about" element={<About />} />
          <Route path="/avatar" element={<AvatarBuilder />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/arcade/word-catcher" element={<WordCatcher />} />
          <Route path="/arcade/bubble-pop" element={<BubblePop />} />
          <Route path="/arcade/speed-spell" element={<SpeedSpell />} />
          <Route path="/arcade/memory-match" element={<MemoryMatch />} />
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
