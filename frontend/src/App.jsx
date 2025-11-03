import {Home, About, NotFound} from './pages';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from "@/components/theme-provider"
import Layout from './Layout.jsx';
import MediBridgeHome from './pages/Home.jsx';
import DoctorLogin from './pages/Doctor/Login.jsx';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import PatientLogin from './pages/Patient/Login.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '',
                element: <MediBridgeHome />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'doctor/auth',
                element: <DoctorLogin />,
            },
            {
                path: 'patient/auth',
                element: <PatientLogin />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]);

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
