import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import { ThemeProvider } from './themes/ThemeContext.jsx';
import Home from './screens/Home.jsx';
import HabitatSelect from './screens/HabitatSelect.jsx';
import TrailSelect from './screens/TrailSelect.jsx';
import Quiz from './screens/Quiz.jsx';
import AnimalReveal from './screens/AnimalReveal.jsx';
import Collection from './screens/Collection.jsx';
import Settings from './screens/Settings.jsx';
import Register from './screens/Register.jsx';
import Login from './screens/Login.jsx';
import Diagnostic from './screens/Diagnostic.jsx';
import MockSATs from './screens/MockSATs.jsx';
import About from './screens/About.jsx';
import OurApproach from './screens/OurApproach.jsx';
import AvatarBuilder from './features/avatars/AvatarBuilder.jsx';
import Arcade from './features/arcade/Arcade.jsx';
import WordCatcher from './features/arcade/WordCatcher.jsx';
import BubblePop from './features/arcade/BubblePop.jsx';
import SpeedSpell from './features/arcade/SpeedSpell.jsx';
import MemoryMatch from './features/arcade/MemoryMatch.jsx';
import MathsDashboard from './screens/maths/MathsDashboard.jsx';
import MathsModuleSelect from './screens/maths/MathsModuleSelect.jsx';
import MathsTopicSelect from './screens/maths/MathsTopicSelect.jsx';
import MathsSession from './screens/maths/MathsSession.jsx';
import MathsDiagnostic from './screens/maths/MathsDiagnostic.jsx';
import MathsAnimalReveal from './screens/maths/MathsAnimalReveal.jsx';
import MathsMockSATs from './screens/maths/MathsMockSATs.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trails" element={<TrailSelect />} />
          <Route path="/habitats" element={<Navigate to="/trails" replace />} />
          <Route path="/habitats/:trailId" element={<HabitatSelect />} />
          <Route path="/quiz/:habitatId" element={<Quiz />} />
          <Route path="/reveal/:habitatId" element={<AnimalReveal />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/mock-sats" element={<MockSATs />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-approach" element={<OurApproach />} />
          <Route path="/avatar" element={<AvatarBuilder />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/arcade/word-catcher" element={<WordCatcher />} />
          <Route path="/arcade/bubble-pop" element={<BubblePop />} />
          <Route path="/arcade/speed-spell" element={<SpeedSpell />} />
          <Route path="/arcade/memory-match" element={<MemoryMatch />} />
          {/* Maths routes */}
          <Route path="/maths" element={<MathsDashboard />} />
          <Route path="/maths/trail/:trailId" element={<MathsModuleSelect />} />
          <Route path="/maths/trail/:trailId/topic/:moduleId" element={<MathsTopicSelect />} />
          <Route path="/maths/session/:moduleId/:topicId" element={<MathsSession />} />
          <Route path="/maths/diagnostic" element={<MathsDiagnostic />} />
          <Route path="/maths/reveal/:topicId" element={<MathsAnimalReveal />} />
          <Route path="/maths/mock-sats" element={<MathsMockSATs />} />
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
