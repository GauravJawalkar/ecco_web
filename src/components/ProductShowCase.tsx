"use cliet";

const ProductShowCase = () => {
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
