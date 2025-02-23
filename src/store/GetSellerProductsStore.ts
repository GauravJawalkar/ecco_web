import { create } from "zustand";


export const useGetSellerProductsStore = create(
    (set) => (
        {
            sellerProducts: {},
            getSellerProducts: async () => {

            }

        }
    )
)