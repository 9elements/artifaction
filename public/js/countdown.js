const countDown = () => {
  const element = document.getElementById("countdown")

  const now = new Date().getTime()
  const then = new Date("Jun 1, 2022").getTime()
  const diff = then - now
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const hoursRemaining = hours % 24
  const minutesRemaining = minutes % 60
  const secondsRemaining = seconds % 60

  element.innerHTML = `
    <span aria-hidden>${days}d /</span>
    <span aria-hidden>${hoursRemaining}h /</span>
    <span aria-hidden>${minutesRemaining}m /</span>
    <span aria-hidden>${secondsRemaining}s </span>
  `
  element.setAttribute(
    "aria-label",
    `Release ${days} days, ${hoursRemaining} hours, ${minutesRemaining} minutes`
  )
}

setInterval(countDown, 1000)
