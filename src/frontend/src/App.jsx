import './App.css'
import Button from './components/Button';
import Navbar from "./components/Navbar";
import btnStyle from './styles/Button.module.css';

function App() {
  return (
    <>
        <Navbar/>
        <Button text = {"Freelancer"} className={btnStyle.button} />
        <Button text = {"Employer"} className={btnStyle.button}/>
        <Button text = {"Arbiter"} className={btnStyle.button}/>
    </>
  )
}

export default App
