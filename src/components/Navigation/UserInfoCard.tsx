
import { Pencil, ShieldCheck } from 'lucide-react'

interface UserInfoCardProps {
    dataLength: number,
    dataValue: string,
    cardTitle: string
}

const UserInfoCard = ({ dataLength, dataValue, cardTitle }: UserInfoCardProps) => {
    return (
        <div className="flex flex-col items-start justify-start gap-3 p-5 mb-4 font-semibold border rounded dark:border-neutral-700 dark:bg-neutral-800/30">
            <div className='font-normal capitalize text-md'>{dataLength !== 0 && cardTitle} :</div>
            <div className="w-1/3 p-3 border rounded-md dark:border-neutral-700 hover:cursor-not-allowed">
                <span className="font-normal text-gray-500 dark:text-gray-400">
                    {dataLength !== 0 && dataValue}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <button className="text-red-500 border  hover:bg-gray-200 dark:hover:bg-[#3a3a3a] dark:border-neutral-700 transition ease-in-out duration-200 px-4 py-1 rounded-sm text-base font-normal flex items-center justify-center gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit
                </button>

                <button disabled type='button' className="text-green-500 border  hover:bg-gray-200 dark:hover:bg-[#3a3a3a] dark:border-neutral-700 transition ease-in-out duration-200 px-4 py-1 rounded-sm text-base font-normal flex items-center justify-center gap-2 cursor-not-allowed">
                    <ShieldCheck className="w-4 h-4" />
                    Verified
                </button>
            </div>
        </div>
    )
}

export default UserInfoCard