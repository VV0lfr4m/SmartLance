import '../styles/LinesOverlay.css';

const LinesOverlay = () => {
    return (
        <div className="lines-overlay">
            <div className="g-1">
                <div className="line line-small-1"></div>
                <div className="line line-middle-1"></div>
                <div className="line line-long"></div>
                <div className="line line-middle-2"></div>
                <div className="line line-small-2"></div>
            </div>
            <div className="line line-separator"></div>
            <div className="g-2">
                <div className="line line-small-1"></div>
                <div className="line line-middle-1"></div>
                <div className="line line-long"></div>
                <div className="line line-middle-2"></div>
                <div className="line line-small-2"></div>
            </div>
        </div>
    );
};

export default LinesOverlay;
