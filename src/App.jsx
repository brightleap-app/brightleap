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
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
