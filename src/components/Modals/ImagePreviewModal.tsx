
import { ChevronLeft, ChevronRight, CircleX } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ImagePreviewModal = ({ onClose, isVisible, images }: { onClose: () => void, isVisible: boolean, images: any }) => {

    const [arrayPointer, setArrayPointer] = useState(0);

    if (!isVisible) return null;
    return (
        <section className='fixed inset-0 z-20 flex items-center justify-center h-screen'>
            <div className='w-[500px] flex items-center justify-center flex-col px-10 py-8 rounded-xl bg-slate-600/5  relative'>
                <div className='pb-5 text-end'>
                    <CircleX className='w-8 h-8 cursor-pointer ' onClick={onClose} />
                </div>
                <Image src={images?.[arrayPointer]} priority alt={"review image"} height={2000} width={2000} className="h-[400px] w-[400px] object-cover" />

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