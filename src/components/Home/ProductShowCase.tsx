"use cliet";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductShowCase = () => {
  const [data, setData] = useState([]);

  async function getSpecialShowCaseProducts() {
    try {
      const response = await axios.get('../api/getSplAppReq');

      if (response.data.data) {
        setData(response.data.data)
        console.log(data)
        toast.success("Special Products are here")
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch the special products")
    }
  }

  useEffect(() => {
    getSpecialShowCaseProducts()
  }, [])

  return (
    <div className="my-10">
      <div className="grid grid-cols-2 gap-10">
        <div className="h-64 border p-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="border h-52">Product One</div>
            <div className="border h-52">Product Two</div>
          </div>
        </div>
        <div className="h-64 border p-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="border h-52">1</div>
            <div className="border h-52">1</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowCase;
