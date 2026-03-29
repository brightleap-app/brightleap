import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import Home from './screens/Home.jsx';
import HabitatSelect from './screens/HabitatSelect.jsx';
import Quiz from './screens/Quiz.jsx';
import AnimalReveal from './screens/AnimalReveal.jsx';
import Collection from './screens/Collection.jsx';
import Settings from './screens/Settings.jsx';
import Register from './screens/Register.jsx';
import Login from './screens/Login.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/habitats" element={<HabitatSelect />} />
          <Route path="/quiz/:habitatId" element={<Quiz />} />
          <Route path="/reveal/:habitatId" element={<AnimalReveal />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
