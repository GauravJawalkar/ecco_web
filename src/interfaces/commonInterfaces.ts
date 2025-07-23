export interface userProps {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    isSeller: boolean;
    isEmailVerified: boolean;
    isSuperAdmin: boolean;
    store: boolean;
    bankDetails: {
        accountNumber: string;
        ifscCode: string;
        bankName: string;
        status: string; // KYC verification status
    };
    storeDetails: {
        storeName: string;
        storeId: string;
    };
}