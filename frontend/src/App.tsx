import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeamManager from './pages/admin/TeamManager';
import EventManager from './pages/admin/EventManager';
import GalleryManager from './pages/admin/GalleryManager';
import ConfigManager from './pages/admin/ConfigManager';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/team" element={<Layout><Team /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          
          {/* Admin routes without Layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/team" element={<TeamManager />} />
          <Route path="/admin/events" element={<EventManager />} />
          <Route path="/admin/gallery" element={<GalleryManager />} />
          <Route path="/admin/config" element={<ConfigManager />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
