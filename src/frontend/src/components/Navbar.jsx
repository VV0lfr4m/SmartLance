import NavItem from "./NavItem";
import Button from "./Button";
import navStyles from '../styles/Navbar.module.css';
import logo from "../assets/logoMini.svg";
import {useMemo, useEffect, useCallback} from "react";
import {useState} from "react";


function Navbar() {
    const [walletAddress, setWalletAddress] = useState("");
    const [isConnecting, setIsConnecting] = useState(false); // ← додано

    useEffect(() => {
        getCurrentWalletConnected().catch(err => console.error("Error fetching wallet:", err));

        if (!window.ethereum) return;
        const handler = (accounts) => setWalletAddress(accounts[0] || "");
        window.ethereum.on("accountsChanged", handler);
        return () => window.ethereum.removeListener("accountsChanged", handler);
    }, []);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) { alert("Metamask is not installed"); return; }
        if (isConnecting || walletAddress) return;            // ← стопимо дублікати

        setIsConnecting(true);
        try {
            // спочатку тихо перевіряємо, чи вже підключені
            const existing = await window.ethereum.request({ method: "eth_accounts" });
            if (existing?.length) { setWalletAddress(existing[0]); return; }

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setWalletAddress(accounts[0]);
        } catch (e) {
            // -32002 = вже відкритий запит у MetaMask
            if (e?.code === -32002) alert("Підтверди або закрий вже відкритий запит у MetaMask, потім спробуй знову.");
            else if (e?.code === 4001) console.log("User rejected connection");
            else console.error(e);
        } finally {
            setIsConnecting(false);
        }
    }, [walletAddress, isConnecting]); // ← критично

    const getCurrentWalletConnected = async () => {
        if (!window.ethereum) { alert("Metamask is not installed"); return; }
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            setWalletAddress(accounts[0] || "");
        } catch (err) { console.error(err); }
    };

    const displayWallet = useMemo(() =>
            walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : "Connect Wallet",
        [walletAddress]);


    return (
        <nav className={navStyles.navbar}>
            <img src={logo} alt="logo" className="logo-img"/>
            <h3 className={navStyles.logo}>Smartlance</h3>
            <div className={navStyles.navLinks}>
                <NavItem className={navStyles.navItem} text="Home" href="/#home"/>
                <NavItem className={navStyles.navItem} text="About Us" href="/#about"/>
                <NavItem className={navStyles.navItem} text="How it works" href="/#how-it-works"/>
                <NavItem className={navStyles.navItem} text="Contacts" href="/#contact"/>
            </div>
            <Button onClick={connectWallet} disabled={isConnecting} text={displayWallet} className={navStyles.btn}/>
        </nav>
    );
}

export default Navbar;
