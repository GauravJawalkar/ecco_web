
import { ChevronLeft, ChevronRight, CircleX, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ImagePreviewModal = ({ onClose, isVisible, images }: { onClose: () => void, isVisible: boolean, images: any }) => {

    const [arrayPointer, setArrayPointer] = useState(0);

    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300 animate-in fade-in">
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <div className="text-white/80 font-medium text-sm tracking-widest pointer-events-auto bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    {arrayPointer + 1} / {images?.length || 0}
                </div>
                <button
                    onClick={onClose}
                    className="p-3 text-white/70 hover:text-white bg-black/20 hover:bg-white/10 rounded-full backdrop-blur-md transition-all pointer-events-auto border border-white/10"
                    aria-label="Close preview"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Navigation Left */}
            <button
                disabled={arrayPointer === 0}
                onClick={() => setArrayPointer((prev) => Math.max(prev - 1, 0))}
                className="absolute left-4 sm:left-12 p-3 sm:p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none z-50 hover:scale-110 active:scale-95"
            >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full max-w-[90vw] max-h-[85vh] flex items-center justify-center p-4 sm:p-12 animate-in zoom-in-95 duration-400 ease-out">
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src={images?.[arrayPointer]}
                        priority
                        alt={`Preview image ${arrayPointer + 1}`}
                        fill
                        className="object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.05)] transition-opacity duration-300"
                    />
                </div>
            </div>

            {/* Navigation Right */}
            <button
                disabled={arrayPointer >= (images?.length || 1) - 1}
                onClick={() => setArrayPointer((prev) => Math.min(prev + 1, images.length - 1))}
                className="absolute right-4 sm:right-12 p-3 sm:p-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none z-50 hover:scale-110 active:scale-95"
            >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
            </button>

            {/* Bottom Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 bg-black/20 p-3 rounded-full backdrop-blur-md border border-white/10">
                {images?.map((_: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setArrayPointer(idx)}
                        className={`transition-all duration-300 rounded-full ${arrayPointer === idx ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
                        aria-label={`Go to image ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImagePreviewModal