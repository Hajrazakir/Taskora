import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import LandingPage from '@/pages/landing';
import LoginPage from '@/pages/login';
import SignupPage from '@/pages/signup';
import Dashboard from '@/pages/dashboard';
import NotFound from '@/pages/not-found';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
