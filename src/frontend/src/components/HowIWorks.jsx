import '../styles/HowItWorks.css';
import LinesOverlay from "./LinesOverlay";


const HowItWorks = () => {
    const steps = [
        {
            title: "Client",
            icon: "client.svg",
            description: [
                "Fills out the task form: description, budget, and deadline.",
                "Once the task is confirmed, the funds are locked in the TaskManager smart contract."
            ],
            result: "The task is created and displayed in the list of available tasks for freelancers."
        },
        {
            title: "Freelancer",
            icon: "freelancer.svg",
            description: [
                "Browses the list of available tasks.",
                "Clicks 'Accept Task' and becomes the freelancer for this task.",
                "The smart contract automatically assigns the freelancer to the task."
            ],
            result: 'The task status changes to "In Progress".'
        },
        {
            title: "Arbitrator",
            icon: "arbitrator.svg",
            description: [
                "If the client or freelancer disagrees with the work result, they initiate arbitration through the ArbitrationManager smart contract.",
                "The arbitrator reviews the dispute and decides who receives the funds."
            ],
            result: "The funds are transferred to the dispute winner."
        },
        {
            title: "System",
            icon: "system.svg",
            description: [
                "Automatically processes tasks, arbitration, and fund transfers."
            ],
            result: "All actions are recorded on the blockchain, ensuring transparency. Funds are held in the Escrow system, making them impossible to steal or use until conditions are met."
        }
    ];

    return (
        <div className="how-it-works">
            <h2>How it works</h2>
            <div className="steps">
                {steps.map((step, index) => (
                    <div key={index} className="step">
                        <img src={`/src/assets/icons/${step.icon}`} alt={step.title} className="step-icon" />
                        <div className="step-text">
                            <h3>{step.title}</h3>
                            <h4>What they do:</h4>
                            <ul>
                                {step.description.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                            <p><span className="result">Result: </span>{step.result}</p>
                        </div>
                    </div>
                ))}
            </div>
            <LinesOverlay/>
        </div>

    );
};

export default HowItWorks;
