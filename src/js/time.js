let timer = null
let initTime = 0
const timeContainer = document.getElementById('time')
//計時器
export const countDown = () => {
    timer = setInterval(() => {
        if(initTime > 900){
            alert("時間到")
            cleanTimer()
            return 
        }
        initTime++
        const mm = Math.floor(Math.floor(initTime % 3600) / 60)
        const ss = initTime % 60
        timeContainer.textContent = `${transTime(mm)}:${transTime(ss)}`
    }, 1000);
}

export const cleanTimer = () =>{
    initTime = 0
    clearInterval(timer)
}

const transTime = (num) => {
    if (num < 10) return '0' + num
    return num
}
