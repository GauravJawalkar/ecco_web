"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import SliderOneImage from '../../../public/SliderOneImage.png'
import SliderTwoImage from '../../../public/SliderTwoImage.png'
import SliderThreeImage from '../../../public/SliderThreeImage.png'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "../../app/globals.css";


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

const HomeHero = () => {

    return (
        // Full Screen Slider
        <div className='pt-4'>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper h-fit">
                <SwiperSlide>
                    <div >
                        <Image src={SliderOneImage}
                            priority
                            className="w-full h-[400px] rounded-2xl" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='w-full overflow-hidden'>
                        <Image src={SliderTwoImage}
                            priority
                            className="w-full h-[400px] rounded-2xl" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div>
                        <Image src={SliderThreeImage}
                            priority
                            className="w-full h-[400px] rounded-2xl" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div >
    )
}

export default HomeHero