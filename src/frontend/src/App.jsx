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
            <HeroText/>
            <LogoCarousel/>
            <AboutUs/>
            <HowItWorks/>
            <Footer/>
            {/*<BackgroundGrid>
                    <Navbar/>
                </BackgroundGrid>*/}
        </div>

    )
}

export default App
