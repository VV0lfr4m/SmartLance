import './App.css'
import Button from './components/Button';
import Navbar from "./components/Navbar";
import btnStyle from './styles/Button.module.css';
import LogoCarousel from "./components/LogoCarousel";
import { HelmetProvider } from "react-helmet-async";

function App() {
    return (
        <>
            <Navbar/>
            <div className="blurred-ellipse"/>
            <div className="button-container">
                <Button text={"Freelancer"} className={btnStyle.button}/>
                <Button text={"Employer"} className={btnStyle.button}/>
                <Button text={"Arbiter"} className={btnStyle.button}/>
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <LogoCarousel/>
            </div>
        </>

    )
}

export default App
