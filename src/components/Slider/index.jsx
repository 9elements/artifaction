import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper"
import cx from "classnames"

import "./swiper.css"
import styles from "./styles.module.css"

const Slider = () => {
  const images = [
    { src: "/images/visuals/slider/artifact-blue.svg" },
    { src: "/images/visuals/slider/artifact-green.svg" },
    { src: "/images/visuals/slider/artifact-pink.svg" },
    { src: "/images/visuals/slider/artifact-purple.svg" },
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
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <img
              width="800"
              height="800"
              src={image.src}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Slider
