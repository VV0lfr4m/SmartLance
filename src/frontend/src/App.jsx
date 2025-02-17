import './App.css'
import Navbar from "./components/Navbar";
import LogoCarousel from "./components/LogoCarousel";
import HeroText from "./components/HeroText";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowIWorks";
import Footer from "./components/Footer";

function App() {
    return (

        <div>
            <Navbar/>
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
        </div>

    )
}

export default App
