import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper"
import cx from "classnames"

import "./swiper.css"
import styles from "./styles.module.css"

const Slider = () => {
  const images = [
    { src: "/images/visuals/slider/slider-visual-black.svg" },
    { src: "/images/visuals/slider/slider-visual-green.svg" },
    { src: "/images/visuals/slider/slider-visual-blue-sage.svg" },
    { src: "/images/visuals/slider/slider-visual-pink.svg" },
    { src: "/images/visuals/slider/slider-visual-purple.svg" },
  ]

  return (
    <section className={cx(styles.wrapper, "section")}>
      <Swiper
        slidesPerView="auto"
        loopedSlides={images.length}
        centeredSlides
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        grabCursor
        loop
        speed={1000}
        className={styles.slider}
      >
        {images.map((image) => (
          <SwiperSlide>
            <img width="800" height="800" src={image.src} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Slider
