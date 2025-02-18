import './App.css'
import Navbar from "./components/Navbar";
import LogoCarousel from "./components/LogoCarousel";
import HeroText from "./components/HeroText";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowIWorks";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployerPage from "./pages/EmployerPage";

function App() {
    return (

        <Router>
            <Navbar/>
            <Routes>
                {/*Landing Page*/}
                <Route path="/" element={
                    <>
                        <div className="blurred-ellipse"/>
                        {/* Home Section */}
                        <section id="home">
                            <HeroText/>
                            <LogoCarousel/>
                        </section>

                        {/* About Us Section */}
                        <section id="about">
                            <AboutUs/>
                        </section>

                        {/* How It Works Section */}
                        <section id="how-it-works">
                            <HowItWorks/>
                        </section>

                        {/* Contact Section (Footer) */}
                        <section id="contact">
                            <Footer/>
                        </section>
                        {/*<BackgroundGrid>
                    <Navbar/>
                </BackgroundGrid>*/}
                    </>
                }/>
                {/* Employer Page */}
                <Route path="/employer" element={<EmployerPage />} />
                {/* Freelancer Page */}
                <Route path="/freelancer"  />
                {/* Arbiter Page */}
                <Route path="/arbiter"  />
            </Routes>
        </Router>

    )
}

export default App
