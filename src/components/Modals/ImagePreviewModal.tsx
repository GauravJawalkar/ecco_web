import { CircleX } from "lucide-react";
import Image from "next/image";


const ImagePreviewModal = ({ onClose, isVisible, image }: { onClose: () => void, isVisible: boolean, image: string }) => {

    if (!isVisible) return null;
    return (
        <section className='inset-0 fixed flex items-center justify-center h-screen z-20'>
            <div className='w-[500px] flex items-center justify-center flex-col px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-sm'>
                <div className='text-end pb-5'>
                    <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                </div>
                <Image src={image} priority alt={"review image"} height={2000} width={2000} className="h-full w-full object-contain" />
            </div >
        </section >
    )
}

export default ImagePreviewModal