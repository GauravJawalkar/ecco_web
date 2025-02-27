import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from './Loader';
import { CircleX } from 'lucide-react';

const AddProductModal = ({ isVisible, onClose }: any) => {


    const { data }: any = useUserStore();
    const [loading, setLoading] = useState(false)
    const [imgArray, setImgArray] = useState([]);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState("")
    const [price, setPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [size, setSize] = useState("")
    const [category, setCategory] = useState("")
    const [primeImage, setPrimeImage] = useState("");
    const [secondImage, setSecondImage] = useState("");

    const handelFileChanges = async (e: any) => {
        setImgArray(Array.from(e.target.files))
    }

    const handelSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('images', images);
            formData.append('primeImage', primeImage);
            formData.append('secondImage', secondImage);
            formData.append('name', name);
            formData.append('seller', data._id);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('size', size);
            formData.append('category', category);

            const response = await axios.post('/api/addProduct', formData);

            if (await response.data.data) {
                setName("");
                setDescription("");
                setImages("");
                setPrice("");
                setDiscount("");
                setSize("");
                setCategory("");
                setImgArray([]);
                setLoading(false);
                onClose();
                toast.success("Product Added Successfully");
            } else {
                setLoading(false)
                toast.error('Error Adding Product')
            }

        } catch (error) {
            setLoading(false)
            console.log("Error in adding the product", error);
        }
    }

    useEffect(() => {
        setImages(imgArray[0]);
        setPrimeImage(imgArray[1]);
        setSecondImage(imgArray[2]);
    }, [imgArray])


    if (!isVisible) return null;

    return (
        <>
            <section className='inset-0 absolute flex items-center justify-center backdrop-blur-md h-max z-10 h-screen'>
                <div className='w-[500px] flex items-center justify-center px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                    <form onSubmit={handelSubmit} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                        <div className='text-end'>
                            <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                        </div>
                        <div className='w-full'>
                            <label>Name :</label>
                            <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Name' required onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Description :</label>
                            <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Description' required onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Images :</label>
                            <input type="file" className='text-black px-3 py-2 w-full rounded bg-white' placeholder='Images' required onChange={handelFileChanges}
                                multiple />
                        </div>
                        <div className='w-full'>
                            <label>Price :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Price' required onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Discount :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Discount' required onChange={(e) => setDiscount(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Size :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Size' required onChange={(e) => setSize(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <label>Category :</label>
                            <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Category' required onChange={(e) => setCategory(e.target.value)} />
                        </div>

                        <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                            {
                                loading ?
                                    <Loader title='Adding ' /> :
                                    "Add products"
                            }
                        </button>
                    </form>
                </div >
            </section >
        </>
    )
}

export default AddProductModal