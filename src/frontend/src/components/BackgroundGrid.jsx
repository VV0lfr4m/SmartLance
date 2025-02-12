

const BackgroundGrid = ({ children }) => {
    return (
        <div className="relative w-full h-full z-[2]">
            {/* Грід як фон */}
            <div className="relative inset-0 grid grid-cols-10 grid-rows-10">
                {[...Array(100)].map((_, index) => (
                    <div key={index} className="border bg-red-900 hover:bg-gray-700/50 duration-200 pointer-events-auto "></div>
                ))}
            </div>
            <div className="relative z-[1]">
                {children}
            </div>
        </div>

    );
};

export default BackgroundGrid;
