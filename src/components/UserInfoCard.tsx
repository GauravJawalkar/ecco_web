
import { Pencil, ShieldCheck } from 'lucide-react'

interface UserInfoCardProps {
    dataLength: number,
    dataValue: string,
    cardTitle: string
}

const UserInfoCard = ({ dataLength, dataValue, cardTitle }: UserInfoCardProps) => {
    return (
        <div className="p-5 mb-4 border-slate-300 dark:border-[#5a5a5a] font-semibold border rounded flex items-start flex-col justify-start gap-3">
            <div className='capitalize font-normal text-md'>{dataLength !== 0 && cardTitle} :</div>
            <div className="border w-1/3 p-3 border-slate-300 dark:border-[#5a5a5a] rounded-md hover:cursor-not-allowed">
                <span className="text-gray-500 dark:text-gray-400 font-normal">
                    {dataLength !== 0 && dataValue}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <button className="text-red-500 border border-slate-300 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] dark:border-[#5a5a5a] transition ease-in-out duration-200 px-4 py-1 rounded-sm text-base font-normal flex items-center justify-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                </button>

                <button className="text-green-500 border border-slate-300 hover:bg-gray-200 dark:hover:bg-[#3a3a3a] dark:border-[#5a5a5a] transition ease-in-out duration-200 px-4 py-1 rounded-sm text-base font-normal flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Verify
                </button>
            </div>
        </div>
    )
}

export default UserInfoCard