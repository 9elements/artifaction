import useCountdown from "react-use-countdown"
import styles from "./styles.module.css"

const CountDown = () => {
  const countdown = useCountdown(() => new Date("06-01-2022"))
  const convertedDate = new Date(countdown)

  const days = convertedDate.getDate()
  const hours = convertedDate.getHours()
  const minutes = convertedDate.getMinutes()
  const seconds = convertedDate.getSeconds()

  const isOver = countdown <= 0

  return isOver ? null : (
    <p className={styles.countdown}>
      <span>{days}d </span>
      <span>{hours}h </span>
      <span>{minutes}m </span>
      <span>{seconds}s </span>
    </p>
  )
}

export default CountDown
