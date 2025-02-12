import React from "react";

const images = Object.values(import.meta.glob("/src/assets/Frame*.png", { eager: true }))
    .map((img) => img.default);

const LogoCarousel = () => {
    return (
        <div className="relative w-full overflow-hidden bg-slate-900 py-10 bg-transparent">
            <div className="flex w-[300%] flex-nowrap mx-auto animate-infinite-scroll gap-10">
                {/* Два ідентичних списки для плавного переходу */}
                {images.concat(images).concat(images).map((src, index) => (
                    <img key={index} src={src} alt="Logo" className="!h-8 !w-auto !object-contain" />
                ))}
            </div>
        </div>

    );
};

export default LogoCarousel;
