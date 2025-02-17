import '../styles/AboutUs.css';



function AboutUs() {
    return (
        <div className="about-container">
            <h2 className="about-header">About us</h2>
            <p className="about-text">
                SmartLance is an innovative freelance platform built on blockchain technology.
                It ensures transparent, secure, and automated interactions between freelancers and clients,
                eliminating the need for intermediaries. Our mission is to make the freelance market secure,
                accessible, and fair for all participants by leveraging the benefits of Web3.
            </p>
            <div className="blocks-container">
                {[
                    { title: "Smart Contracts", text: "Guarantees the fulfillment of agreements between parties without the risk of fraud.", icon:"SC" },
                    { title: "Cryptocurrency Payments", text: "Instant transactions with no banking fees. Payments available in Ethereum and Arbitrum.", icon:"CP" },
                    { title: "Arbitration System", text: "Dispute resolution through decentralized arbitrators.", icon:"arbitrator" },
                    { title: "Transparent Reputation System", text: "Freelancer and client ratings are stored on the blockchain.", icon:"TRS" }
                ].map((item, index) => (
                    <div key={index} className="block">
                        <img src={`/src/assets/icons/${item.icon}.svg`} alt={item.title} className="block-icon"/>
                        <h3 className="block-header">{item.title}</h3>
                        <p className="block-text">{item.text}</p>
                    </div>
                ))}
            </div>
            <div className="blurred-ellipse-right"/>
        </div>
    );
}

export default AboutUs;
