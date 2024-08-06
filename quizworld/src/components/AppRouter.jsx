import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Navigate,
} from 'react-router-dom';
import App from './App';
import LoginPage from './LogInPage';
import AddQuestion from './AddQuestion';
import PrivateRoute from './PrivateRoute';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <div className="error404-message">
        404 Not Found <Link to="/">Go back to home page.</Link>
      </div>
    ),
  },
  { path: '/logIn', element: <LoginPage /> },
  {
    path: '/addQuestion',
    element: <PrivateRoute element={<AddQuestion />} />,
  },
  {
    path: '*', // Wildcard route to catch all undefined paths
    element: <Navigate to="/" replace />,
  },
]);

export default AppRouter;
