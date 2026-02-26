import React, { useEffect, lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { authService } from './services/authService';

// Lazy-loaded route components for code splitting
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Chat = lazy(() => import('./components/Chat'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const Contact = lazy(() => import('./components/Contact'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

// OAuth Callback handler
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const result = await authService.handleAuthCallback();
        if (result?.user) {
          if (authService.isAdmin()) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {error ? 'Authentication Error' : 'Completing Authentication...'}
        </h2>
        {error ? (
          <p className="text-red-600 mb-4 text-center">{error}</p>
        ) : (
          <p className="text-gray-600 mb-4 text-center">
            Please wait while we complete your authentication.
          </p>
        )}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

// Protected route wrapper for admin-only routes
const AdminRoute = ({ children }) => {
  const location = useLocation();

  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authService.isAdmin()) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

// Protected route wrapper for authenticated users
const AuthRoute = ({ children }) => {
  const location = useLocation();

  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Navigation header with dynamic links based on auth state
const Navigation = () => {
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav data-testid="main-nav" className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 w-full">
      <div>
        <Link
          to="/contact"
          className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
        >
          Contact
        </Link>
      </div>
      <div className="flex space-x-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Admin Dashboard
              </Link>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
          >
            Login
          </Link>
        )}
      </div>
      </nav>
  );
};

const App = () => {
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();

  return (
    <Router>
      <ErrorBoundary>
        {/* Skip to main content for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-md focus:text-blue-600 focus:font-medium"
        >
          Skip to main content
        </a>
        <Suspense fallback={<PageLoader />}>
          <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col justify-center relative">
              <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none
                  transition-transform duration-300 ease-in-out
                  [@media(min-aspect-ratio:16/9)]:scale-[1.2]
                  [@media(min-aspect-ratio:16/9)]:-translate-y-[10%]
                  [@media(max-aspect-ratio:16/9)]:scale-[1.1]
                  [@media(max-aspect-ratio:16/9)]:-translate-y-[5%]"
                  data-testid="background"
                >
                  <source src="/background.mp4" type="video/mp4" data-testid="video-source" />
                </video>
              </div>
              <Navigation />
              <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  AI-Powered Customer Support
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                  Provide instant, 24/7 support to your customers with Swift Assist.
                </p>
                <div className="mt-8">
                  <Link
                    to={isLoggedIn ? (isAdmin ? '/admin' : '/chat') : '/login'}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              </main>
            </div>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <UserDashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/customer-context"
          element={
            <AuthRoute>
              <Chat showContextEditor={true} />
            </AuthRoute>
          }
        />
        <Route path="/contact" element={<Contact />} />

        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
