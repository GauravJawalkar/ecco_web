
import { ChevronLeft, ChevronRight, CircleX } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ImagePreviewModal = ({ onClose, isVisible, images }: { onClose: () => void, isVisible: boolean, images: any }) => {

    const [arrayPointer, setArrayPointer] = useState(0);

    if (!isVisible) return null;
    return (
        <section className='inset-0 fixed flex items-center justify-center h-screen z-20'>
            <div className='w-[500px] flex items-center justify-center flex-col px-10 py-8 rounded-xl bg-slate-600/5 backdrop-blur-sm relative'>
                <div className='text-end pb-5'>
                    <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                </div>
                <Image src={images[arrayPointer]} priority alt={"review image"} height={2000} width={2000} className="h-full w-full object-contain" />

                <button disabled={arrayPointer === 0} onClick={() => { setArrayPointer(arrayPointer - 1) }} className={`absolute left-0 top-1/2 -translate-y-1/2 ${arrayPointer === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <ChevronLeft className="h-8 w-8" />
                </button>
                <button disabled={arrayPointer >= 2} onClick={() => { setArrayPointer(arrayPointer + 1) }}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 ${arrayPointer >= 2 ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <ChevronRight className="h-8 w-8" />
                </button>
            </div >
        </section >
    )
}

export default ImagePreviewModal