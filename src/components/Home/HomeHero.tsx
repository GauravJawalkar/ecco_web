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
        <div className='pt-4 '>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !mx-1 !bg-gray-300 dark:!bg-neutral-600',
                    bulletActiveClass: '!bg-gray-800 dark:!bg-white'
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper">
                <SwiperSlide>
                    <div>
                        <Image src={'/Slider/1.png'}
                            priority
                            width={2000}
                            height={2000}
                            className="w-full h-full rounded-2xl" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div>
                        <Image src={'/Slider/2.png'}
                            priority
                            width={2000}
                            height={2000}
                            className="w-full h-full rounded-2xl" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div>
                        <Image src={'/Slider/4.png'}
                            priority
                            width={2000}
                            height={2000}
                            className="w-full h-full rounded-2xl" alt={'SliderOneImage'} />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div >
    )
}

export default HomeHero