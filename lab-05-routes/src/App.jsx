import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "./components/RootLayout.jsx";
import SignsLayout from "./components/SignsLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignListPage from "./pages/SignListPage.jsx";

const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const SignDetailPage = lazy(() => import("./pages/SignDetailPage.jsx"));
const SignFormPage = lazy(() => import("./pages/SignFormPage.jsx"));

export default function App() {
  return (
    <BrowserRouter basename="/React/routes">
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="signs" element={<SignsLayout />}>
            <Route index element={<SignListPage />} />
            <Route path="new" element={<SignFormPage />} />
            <Route path=":id" element={<SignDetailPage />} />
          </Route>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
