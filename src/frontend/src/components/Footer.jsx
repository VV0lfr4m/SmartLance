import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Left Section */}
                <div className="footer-left">
                    <h2 className="footer-title">Smartlance</h2>
                    <p className="footer-tagline">
                        SmartLance – Freelancing without borders, with trust and no intermediaries.
                    </p>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Get started</h4>
                            <a href="#">Become a freelancer</a>
                            <a href="#">Become an employer</a>
                            <a href="#">Find work</a>
                            <a href="#">Find candidates</a>
                        </div>
                        <div className="footer-column">
                            <h4>Connect with us</h4>
                            <div className="social-icons">
                                <img src="/src/assets/bi_twitter-x.svg" alt="x" className="icon"/>
                                <img src="/src/assets/lucide_github.svg" alt="github" className="icon"/>
                            </div>
                            <a href="mailto:vladlen.tsykin@gmail.com">vladlen.tsykin@gmail.com</a>
                        </div>
                    </div>
                </div>

                {/* Right Section: Stacked Blocks */}
                <div className="footer-right">
                    <div className="footer-block-grid">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className={`footer-block ${index % 2 === 0 ? "footer-block-dark-left" : "footer-block-dark-right"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;