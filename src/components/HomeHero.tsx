"use client"

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SliderOneImage from '../../public/SliderOneImage.png'
import SliderTwoImage from '../../public/SliderTwoImage.png'
import SliderThreeImage from '../../public/SliderThreeImage.png'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "../app/globals.css";

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

const HomeHero = () => {

    return (
        // Full Screen Slider
        <div>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    el: '.swiper-paginationn', clickable: true
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide className='h-screen'>
                    <div>
                        <Image src={SliderOneImage}
                            className="w-full h-64 object-cover" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
                <SwiperSlide className='h-screen'>
                    <div>
                        <Image src={SliderTwoImage} height={200} width={200}
                            className="w-full h-64 object-cover" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
                <SwiperSlide className='h-screen'>
                    <div>
                        <Image src={SliderThreeImage} height={200} width={200}
                            className="w-full h-64 object-cover" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default HomeHero