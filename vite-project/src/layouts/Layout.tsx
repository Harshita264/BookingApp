import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />   {/* 👈 THIS RENDERS CHILD ROUTES */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
