import { Pencil, ShieldCheck, Lock } from 'lucide-react'

interface UserInfoCardProps {
    dataLength: number,
    dataValue: string,
    cardTitle: string
}

const UserInfoCard = ({ dataLength, dataValue, cardTitle }: UserInfoCardProps) => {
    if (dataLength === 0) return null;

    const isPassword = cardTitle.toLowerCase().includes("password");

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{cardTitle}</p>
                <div className="mt-1 flex items-center gap-2">
                    <p className={`text-sm text-gray-500 dark:text-neutral-400 truncate max-w-[200px] sm:max-w-xs capitalize ${isPassword ? 'tracking-[0.2em] pt-1' : ''}`}>
                        {dataValue}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors active:scale-95">
                    {isPassword ? <Lock className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                    Edit
                </button>
                {!isPassword && (
                    <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg opacity-80 cursor-default">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserInfoCard;