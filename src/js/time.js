let timer = null
let initTime = 0
const timeContainer = document.getElementById('time')
//計時器
export const countDown = () => {
    timer = setInterval(() => {
        initTime++
        const mm = Math.floor(Math.floor(initTime % 3600) / 60)
        const ss = initTime % 60
        timeContainer.textContent = `${transTime(mm)}:${transTime(ss)}`
    }, 1000);
}

export const cleanTimer = () =>{
    clearInterval(timer)
}

const transTime = (num) => {
    if (num < 10) return '0' + num
    return num
}
