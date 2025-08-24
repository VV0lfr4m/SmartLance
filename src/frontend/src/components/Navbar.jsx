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
        const handleAccounts = (accounts) => setWalletAddress(accounts[0] || "");
        const handleDisconnect = () => setWalletAddress("");

        window.ethereum.on("accountsChanged", handleAccounts);
        window.ethereum.on("disconnect", handleDisconnect);

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccounts);
            window.ethereum.removeListener("disconnect", handleDisconnect);
        };
    }, []);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) { alert("Metamask is not installed"); return; }
        if (isConnecting || walletAddress) return;

        setIsConnecting(true);
        try {
            const existing = await window.ethereum.request({ method: "eth_accounts" });
            if (existing?.length) { setWalletAddress(existing[0]); return; }

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setWalletAddress(accounts[0]);
        } catch (e) {
            if (e?.code === -32002) alert("Підтверди або закрий вже відкритий запит у MetaMask, потім спробуй знову.");
            else if (e?.code === 4001) console.log("User rejected connection");
            else console.error(e);
        } finally {
            setIsConnecting(false);
        }
    }, [walletAddress, isConnecting]);

    const disconnectWallet = useCallback(async () => {
        try {
            if (window.ethereum?.request) {
                await window.ethereum.request({
                    method: 'wallet_revokePermissions',
                    params: [{ eth_accounts: {} }],
                });
            }
        } catch (e) {
            // У MetaMask це може бути не підтримано — це ок
            console.log('wallet_revokePermissions not supported / failed:', e?.message || e);
        } finally {
            setWalletAddress("");
        }
    }, []);

    const getCurrentWalletConnected = async () => {
        if (!window.ethereum) { alert("Metamask is not installed"); return; }
        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            setWalletAddress(accounts[0] || "");
        } catch (err) { console.error(err); }
    };

    const displayWallet = useMemo(() => {
        if (!walletAddress) return "Connect Wallet";
        const short = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-3)}`;
        return `${short}  Disconnect`;
    }, [walletAddress]);


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
            <Button
                onClick={walletAddress ? disconnectWallet : connectWallet}
                disabled={isConnecting}
                text={displayWallet}
                className={navStyles.btn}
            />
        </nav>
    );
}

export default Navbar;
