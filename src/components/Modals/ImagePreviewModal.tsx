
import { ChevronLeft, ChevronRight, CircleX, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ImagePreviewModal = ({ onClose, isVisible, images }: { onClose: () => void, isVisible: boolean, images: any }) => {

    const [arrayPointer, setArrayPointer] = useState(0);

    if (!isVisible) return null;
    return (
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-white/5 dark:bg-black/5'>
            <div className='relative w-full max-w-md p-8 bg-white border dark:bg-neutral-900 rounded-xl dark:border-neutral-800'>
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white text-center">Image Preview</h2>
                <Image src={images?.[arrayPointer]} priority alt={"review image"} height={2000} width={2000} className="h-[400px] w-[400px] object-cover rounded-2xl" />

                <button disabled={arrayPointer === 0} onClick={() => { setArrayPointer((prev) => Math.max(prev - 1, 0)); }} className={`absolute left-0 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-5`}>
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <button disabled={arrayPointer >= 2} onClick={() => { setArrayPointer((prev) => Math.min(prev + 1, images.length - 1)); }}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed disabled:opacity-5`}>
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>
        </section>
    )
}

export default ImagePreviewModal