import NavItem from "./NavItem";
import Button from "./Button";
import navStyles from '../styles/Navbar.module.css';
import logo from "../assets/logoMini.svg";
import {useMemo, useEffect, useCallback} from "react";
import {useState} from "react";


function Navbar() {
    const [walletAddress, setWalletAddress] = useState("");
    useEffect(() => {
        getCurrentWalletConnected().catch((err) => console.error("Error fetching wallet:", err));
        addAccountChangeListener().catch((err) => console.error("Error updating wallet:", err));
    }, []);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            alert("Metamask is not installed");
            return;
        }
        if (walletAddress) return;

        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        setWalletAddress(accounts[0]);

    }, []);

    const getCurrentWalletConnected = async () => {
        if (!window.ethereum) {
            alert("Metamask is not installed");
            return;
        }
        try {
            const accounts = await window.ethereum.request({method: 'eth_accounts'});
            if (accounts && accounts.length > 0) {
                setWalletAddress(accounts[0]);
            } else {
                console.log("Connect to Metamask using the connect button");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const addAccountChangeListener = async () => {
        window.ethereum.on("accountsChanged", (accounts) => {
            setWalletAddress(accounts[0]);
        });
    }

    const displayWallet = useMemo(() => {
        return walletAddress
            ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
            : "Connect Wallet"
    }, [walletAddress]);


    return (
        <nav className={navStyles.navbar}>
            <img src={logo} alt="logo" className="logo-img"/>
            <h3 className={navStyles.logo}>Smartlance</h3>
            <div className={navStyles.navLinks}>
                <NavItem className={navStyles.navItem} text="Home" href="#home"/>
                <NavItem className={navStyles.navItem} text="About Us" href="#about"/>
                <NavItem className={navStyles.navItem} text="How it works" href="#how-it-works"/>
                <NavItem className={navStyles.navItem} text="Contacts" href="#contact"/>
            </div>
            <Button onClick={connectWallet}
                    text= {displayWallet}
                    className={navStyles.btn}/>
        </nav>
    );
}

export default Navbar;
