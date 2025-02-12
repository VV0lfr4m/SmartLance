import './App.css'
import Button from './components/Button';
import Navbar from "./components/Navbar";
import btnStyle from './styles/Button.module.css';
import LogoCarousel from "./components/LogoCarousel";
import BackgroundGrid from "./components/BackgroundGrid";
import HeroText from "./components/HeroText";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowIWorks";

function App() {
    return (

        <div>
            <Navbar/>
            <div className="blurred-ellipse"/>
            <HeroText/>
            <LogoCarousel/>
            <AboutUs/>
            <HowItWorks/>

            {/*<BackgroundGrid>
                    <Navbar/>
                </BackgroundGrid>*/}
        </div>

    )
}

export default App
