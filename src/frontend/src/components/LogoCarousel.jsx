import React from "react";

const images = Object.values(import.meta.glob("/src/assets/Frame*.png", { eager: true }))
    .map((img) => img.default);

const LogoCarousel = () => {
    return (
        <div className="w-full overflow-hidden bg-slate-900 py-10">
            <div className="flex w-max animate-infinite-scroll space-x-10">
                {/* Два ідентичних списки для плавного переходу */}
                {images.concat(images).map((src, index) => (
                    <img key={index} src={src} alt="Logo" className="h-16 w-auto object-contain" />
                ))}
            </div>
        </div>

    );
};

export default LogoCarousel;
