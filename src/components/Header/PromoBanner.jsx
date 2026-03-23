function PromoBanner({ offers, currentOfferIndex, setCurrentOfferIndex }) {
    return (
        <div className={`bg-gradient-to-r ${offers[currentOfferIndex].color} text-white py-3 px-4 overflow-hidden shadow-lg`}>
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 md:gap-6">

                <button
                    onClick={() => setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length)}
                    className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition text-xl md:text-2xl"
                >
                    ◀
                </button>

                <div className="flex-grow text-center">
                    <div className="flex items-center justify-center gap-2 mb-1 animate-pulse">
                        <span className="text-3xl md:text-4xl">{offers[currentOfferIndex].emoji}</span>
                    </div>
                    <p className="font-bold text-sm md:text-base">{offers[currentOfferIndex].text}</p>
                    <p className="text-lg md:text-2xl font-black">{offers[currentOfferIndex].deal}</p>
                </div>

                <button
                    onClick={() => setCurrentOfferIndex((prev) => (prev + 1) % offers.length)}
                    className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition text-xl md:text-2xl"
                >
                    ▶
                </button>
            </div>

            <div className="flex justify-center gap-2 mt-3 md:mt-2">
                {offers.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentOfferIndex(idx)}
                        className={`w-2 h-2 rounded-full transition ${idx === currentOfferIndex
                                ? 'bg-white w-6'
                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default PromoBanner;
