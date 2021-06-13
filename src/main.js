import './scss/style.scss';
import * as Card from './js/card.js';
import * as Timer from './js/time';
const tempDeck = [];
const successDeck = [[1, 2, 3], [14, 15, 16], [27, 28, 29], [40, 41, 42]];
const mainDeck = [[], [], [], [], [], [], [], []];
const recordDeck = [];
const defaultCard = [1, 2, 3, 14, 15, 16, 27, 28, 29, 40, 41, 42]
let payload = null //被拖曳的對象

//拖曳使用
let onDragNumber = null,
    onDropNumber = null,
    onDragDeckNumber = null,
    onDropDeckNumber = null,


    // isCacheDeck = false,
    // cacheDeckNumber = null,
    // isSuccessDeck = false,
    isGamePause = true; //遊戲是否為暫停狀態


const mainBlock = document.getElementById('main-card')
const tempDeckContainer = document.getElementById('temp-card')
const shuffleCard = Card.createPokerCard()

//隨機發牌
shuffleCard.map(card => {
    if (defaultCard.includes(card)) return
    const randomOrder = Card.distributeCard(mainDeck)
    mainDeck[randomOrder].push(card)
})


//建立主牌區
const createMainDecks = (isReset = false) => {
    mainDeck.forEach((cardCol, index) => {
        const cardBlock = document.createElement('div')
        cardBlock.id = `card-col_${index}`
        cardBlock.classList.add('card-col')
        cardCol.forEach((card, cardIndex) => {
            const cardInstance = Card.creatSingleCard(card)
            if (!isGamePause && cardIndex === cardCol.length - 1) {
                cardInstance.draggable = true
            }
            cardBlock.appendChild(cardInstance)
            cardInstance.cardNumber = card
            cardInstance.cardGroup = index
            // cardInstance.style.opacity = '1'
            if (!isReset) {
                setTimeout(() => {
                    cardInstance.style.opacity = '1'
                }, cardIndex * index * 30);
            } else {
                cardInstance.style.opacity = '1'
            }
        })
        mainBlock.appendChild(cardBlock)
    })
}

//創建上方牌組區
const createTempDeck = () => {
    Array.from(new Array(8)).forEach((block, index) => {
        const tempDeckHtml = document.createElement('div')
        tempDeckHtml.classList.add('card-top-zone')
        tempDeckHtml.droppable = true
        if (index <= 3) { //暫存區
            tempDeckHtml.classList.add('card-temp-zone')
            tempDeckHtml.id = `card-temp-zone_${index}`
            tempDeckHtml.cardGroup = index
        } else { //完成區
            const doneIndex = index % 4
            tempDeckHtml.id = `card-done-zone_${doneIndex}`
            const [cardNum] = successDeck[doneIndex].slice(-1) //取最後一個

            // if (!isGamePause) {
            //     tempDeckHtml.draggable = true
            // }
            tempDeckHtml.setAttribute("data-cardGroup", doneIndex)
            tempDeckHtml.classList.add('card-done-zone')
            tempDeckHtml.cardGroup = doneIndex
            let cardInstance = null
            if (cardNum) {
                cardInstance = Card.creatSingleCard(cardNum)
                cardInstance.cardNumber = cardNum
                tempDeckHtml.appendChild(cardInstance)
            }
        }
        tempDeckContainer.appendChild(tempDeckHtml)
    })
}


//判斷是否為連續牌
const setContinue = () => {
    const cols = document.getElementsByClassName('card-col')
    for (let i = 0; i < cols.length; i++) {
        const arr = []
        const target = []
        let flag = false;
        let children = cols[i].childNodes
        for (let k = 0; k < children.length - 1; k++) {
            let prev = children[k].cardNumber % 13 !== 0 ? children[k].cardNumber % 13 : 13
            let next = children[k + 1].cardNumber % 13 !== 0 ? children[k + 1].cardNumber % 13 : 13
            let prevSuit = Math.ceil(children[k].cardNumber / 13)
            let nextSuit = Math.ceil(children[k + 1].cardNumber / 13)
            if (prev === (next + 1) && nextSuit + prevSuit !== 5 && nextSuit !== prevSuit) {
                if (!flag) {
                    flag = true
                    target.push(children[k])
                    arr.push([])
                }
                arr[arr.length - 1].push(children[k + 1])
            } else {
                flag = false
            }

            if (k === children.length - 2) {
                if (target.length > 0) {
                    target.forEach((vo, index) => {
                        arr[index].forEach(item => {
                            cols[i].removeChild(item)
                            vo.appendChild(item)
                        })
                    })
                }
            }
        }
    }
    calStyle()
}

//計算style
const calStyle = () => {
    const cols = document.getElementsByClassName('card-col')
    for (let i = 0; i < cols.length; i++) {
        const temp = {}
        let children = cols[i].childNodes
        for (let k = 0; k < children.length; k++) {
            // temp.push(children[k])
            children[k].style.top = `${k * 40}px`
            let inner = children[k].childNodes
            if (inner.length > 1) {
                for (let j = 1; j < inner.length; j++) {
                    if (!temp[k]) temp[k] = 0
                    temp[k]++
                    inner[j].style.top = `${j * 40}px`
                }
            }
        }
        const arr = Object.keys(temp)
        const base = -40
        if (arr.length > 0) {
            for (let k = 0; k < children.length; k++) {
                if (k == Number(arr[0]) + 1) {
                    base += temp[arr[0]] * 40
                    delete temp[arr[0]]
                }
                base += 40
                children[k].style.top = `${base}px`
            }
        }
        // console.log('top',temp,'i',i);
        // for (let j = 1; j < temp.length; j++) {
        //     if(temp[j]){
        //         temp[j].style.top = `${j*40}px`
        //     }
        // }
    }
}

//判斷哪張牌可被拖曳
const setDragable = () => {
    const cols = document.getElementsByClassName('card-col')
    for (let i = 0; i < cols.length; i++) {
        const lastOne = cols[i].lastChild
        if (lastOne) lastOne.draggable = true
        if (lastOne && lastOne.children.length > 1) { //有連續牌
            lastOne.children[lastOne.children.length - 1].draggable = true
        }
    }
}

const gameStart = () => {
    createMainDecks()
    createTempDeck()
    setContinue()
    setDragable()
}

gameStart()

//拖曳事件
const dragStart = e => {
    if (isGamePause) return
    payload = e.target
    onDragDeckNumber = e.target.cardGroup
    onDragNumber = e.target.cardNumber
    if ([onDragNumber] === mainDeck[onDragDeckNumber].slice(-1)) {
        // e.target.style.opacity = .5;
    }
}

const dragEnter = e => {
    e.preventDefault();
    if (!e.target.cardNumber) return
    // if (onDragNumber === onDropNumber) return //對象為自己
}

const dragLeave = e => {
    e.preventDefault();
}


const dragOver = e => {
    e.preventDefault();
}

const drop = e => {
    e.preventDefault()
    if (isGamePause) return

    const isSingle = payload.children.length === 1
    const isDone = e.target.parentNode.className.includes('card-done-zone') ||
        e.target.parentNode.parentNode.className.includes('card-done-zone')
    // 放到暫存區
    const isTempExist = e.target.parentNode.className.includes('card-temp-zone')
    onDropDeckNumber = e.target.cardGroup
    onDropNumber = e.target.cardNumber
    if (e.target.className.includes('card-temp-zone') && isSingle) {
        // cacheDeckNumber = e.target.cardGroup
        dragTempDeck(e)
        return
    }
    if (isTempExist) return
    //判斷花色用
    const drapCardNum = Math.ceil(onDragNumber / 13)
    const dropCardNum = Math.ceil(onDropNumber / 13)
    // console.log('dropCardNum', dropCardNum, onDropNumber);
    // console.log('drapCardNum', drapCardNum, onDragNumber);


    //完成區
    // console.log('e.target.id', e.target.id)
    if (e.target.className.includes('poker-card') && isDone && isSingle) {
        // console.log('success');
        if (dropCardNum === drapCardNum && onDropNumber % 13 === (onDragNumber % 13) - 1) {       
            onDropDeckNumber = e.target.parentNode.getAttribute("data-cardGroup") || e.target.parentNode.parentNode.getAttribute("data-cardGroup")
            dragSuccessDeck(e)
        }
        return
    }

    //比對數字是否依序
    let condition = (onDropNumber % 13 === (onDragNumber % 13) + 1 ||
        (onDropNumber % 13 === 0 && onDragNumber % 13 === 12))

    if (e.target.className.includes('poker-card')) {
        //確認卡片是否有效移動
        const vaildMoveCard = dropCardNum !== drapCardNum && //花色相同
            dropCardNum + drapCardNum !== 5 && condition //黑桃不能對梅花 方塊不能對愛心
        const isCacheCardDeck = e.target.id.indexOf('card-temp-zone') > -1
        if (isCacheCardDeck && vaildMoveCard) { //從暫存區搬回來
            // const cardTempNumber = e.target.id.split('-')[2]
            dragTempDeckToMain()
            // reDraw()
            return
        }

        if (vaildMoveCard) {
            // console.log('vaild');
            dragMainDeck(e)
        }
    }
}


const dragTempDeck = (e) => {
    if (tempDeck[onDropDeckNumber]) return
    recordMove('toTemp')
    mainDeck[onDragDeckNumber].pop()
    tempDeck[onDropDeckNumber] = onDragNumber
    insertHtml(e)
    setDragable()
}

const dragTempDeckToMain = (e) => {
    recordMove('tempToMain')
    tempDeck[onDragDeckNumber] = null
    mainDeck[onDropDeckNumber].push(onDragNumber)
    insertHtml(e)
    setDragable()
}

const dragSuccessDeck = e => {
    recordMove('toSuccessDeck')
    mainDeck[onDragDeckNumber].pop()
    successDeck[onDropDeckNumber].push(onDragNumber)
    insertHtml(e, false)
    setDragable()
    winGame()
}


const dragMainDeck = e => {
    recordMove("toMain")
    mainDeck[onDragDeckNumber].pop()
    mainDeck[onDropDeckNumber].push(onDragNumber)
    insertHtml(e)
    setDragable()
}


const insertHtml = (event, isdrag = true) => {
    payload.parentNode.removeChild(payload);
    payload.draggable = isdrag
    const parentIsPoker = event.target.parentNode.className === "poker-card"
    if (parentIsPoker) {
        event.target.parentNode.appendChild(payload);
    } else {
        event.target.appendChild(payload);
    }
    calStyle()
}

const cancelDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

const wrapper = document.getElementById('wrapper')
wrapper.addEventListener('dragstart', dragStart)
wrapper.addEventListener('dragenter', dragEnter)
wrapper.addEventListener('dragleave', dragLeave)
wrapper.addEventListener('dragover', dragOver)
wrapper.addEventListener('drop', drop, false)

const recordMove = (type) => {
    const pathObj = {
        from: onDragDeckNumber,
        to: onDropDeckNumber,
        cardNumber: onDragNumber,
        action: type
    }
    recordDeck.push(pathObj)
}



const pauseGame = () => {
    isGamePause = !isGamePause
    if (isGamePause) {
        btn.textContent = 'Play'
        Timer.cleanTimer()
        document.querySelector('.mask').style.display = "block"
        // reDraw()
    } else {
        btn.textContent = 'Pause'
        Timer.countDown()
        document.querySelector('.mask').style.display = "none"
    }
}
const btn = document.getElementById('play-btn')
btn.addEventListener('click', pauseGame)



const undo = () => {
    if (recordDeck.length === 0) {
        alert("已經沒有上一步！")
        return
    }
    const lastStep = recordDeck.pop()
    if (lastStep.action === 'toMain') {
        mainDeck[lastStep.to].pop()
        mainDeck[lastStep.from].push(
            lastStep.cardNumber
        )
    } else if (lastStep.action === 'toTemp') {
        tempDeck[lastStep.to] = null
        mainDeck[lastStep.from].push(
            lastStep.cardNumber
        )
        removeDeck(lastStep.to)
    } else if (lastStep.action === 'toSuccessDeck') {
        successDeck[lastStep.to].pop()
        mainDeck[lastStep.from].push(
            lastStep.cardNumber
        )
        removeSuccess(lastStep.to)
    } else if (lastStep.action === 'tempToMain') {
        mainDeck[lastStep.to].pop()
        tempDeck[lastStep.from] = lastStep.cardNumber
    }
    mainBlock.innerHTML = ''
    createMainDecks(true)
    setContinue()
    setDragable()
    // reDraw()
}

const removeDeck = (index) => {
    const tempDeckHTML = document.getElementsByClassName("card-temp-zone")[index]
    tempDeckHTML.innerHTML = ""
}

const removeSuccess = (index) => {
    const successDeckHTML = document.querySelector(`#card-done-zone_${index} poker-card`)
    successDeckHTML.removeChild(successDeckHTML.lastChild)
}


const resetBtn = document.querySelector(".fa-undo")
resetBtn.addEventListener('click', undo)

const winGame = () => {
    const all = successDeck.reduce((total, element) => {
        return total += element.length
    }, 0)
    if (all === 52) {
        Timer.cleanTimer()
        alert("恭喜獲勝")
    }
}

const reset = () => {
    clearInterval(timer)
    timer = null
    cacheDeckNumber = null
    tempDeck = []
    mainBlock.innerHTML = ''
    tempDeckContainer.innerHTML = ''
    timeContainer.textContent = '00:00'
    btn.removeEventListener('click', pause)
}

//右上角不可拉回
//左上角可拉回
//右上預設牌
//上一步
//群體移動
//暫停
//遊戲結束判定
//重新開始
//同花色又連續