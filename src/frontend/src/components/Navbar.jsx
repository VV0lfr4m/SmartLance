import NavItem from "./NavItem";
import Button from "./Button";
import navStyles from '../styles/Navbar.module.css';


function Navbar() {
    return (
        <nav className={navStyles.navbar}>
            <h3 className={navStyles.logo}>Smartlance</h3>
            <div className={navStyles.navLinks}>
                <NavItem className={navStyles.navItem} text="Home" />
                <NavItem className={navStyles.navItem} text="About Us" />
                <NavItem className={navStyles.navItem} text="How it works" />
                <NavItem className={navStyles.navItem} text="Contacts" />
            </div>
            <Button text="Connect Wallet" className={navStyles.btn}/>
        </nav>
    );
}

export default Navbar;
