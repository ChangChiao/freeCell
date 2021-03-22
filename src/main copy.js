import './scss/style.scss';

const tempDeck = [];
const successDeck = [[1, 2, 3], [14, 15, 16], [27, 28, 29], [40, 41, 42]];
const mainDeck = [[], [], [], [], [], [], [], []];
const recordDeck = [];
const defaultCard = [1, 2, 3, 14, 15, 16, 27, 28, 29, 40, 41, 42]
let payload = null

//拖曳使用
let onDragNumber = null,
    onDropNumber = null,
    onDragDeckNumber = null,
    onDropDeckNumber = null,


    isCacheDeck = false,
    cacheDeckNumber = null,
    isSuccessDeck = false,
    isGamePause = false; //遊戲是否為暫停狀態

const distributeCard = () => {
    const randomNum = Math.floor(Math.random() * 8);
    if (randomNum <= 3) {
        if (mainDeck[randomNum].length >= 6) {
            return distributeCard()
        }
    } else {
        if (mainDeck[randomNum].length >= 5) {
            return distributeCard()
        }
    }
    return randomNum
};

//打亂
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let k = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[k]] = [arr[k], arr[i]];
    }
    return arr;
};

//建立1-52張牌
const pokerArr = Array(52).fill(0).map((item, index) => {
    return index + 1;
});

const shuffleCard = shuffle(pokerArr)
//隨機發牌
shuffleCard.map(card => {
    if(defaultCard.includes(card)) return
    const randomOrder = distributeCard()
    mainDeck[randomOrder].push(card)
})

const mainBlock = document.getElementById('main-card')
const createDecks = () => {
    mainDeck.forEach((cardCol, index) => {
        const cardBlock = document.createElement('div')
        cardBlock.id = `card-col_${index}`
        cardBlock.classList.add('card-col')
        cardCol.forEach((card, cardIndex) => {
            const cardInstance = creatCard(card)
            if (!isGamePause && cardIndex === cardCol.length - 1) {
                cardInstance.draggable = true
            }
            cardBlock.appendChild(cardInstance)
            cardInstance.style.top = cardIndex * 40 + 'px'
            cardInstance.cardNumber = card
            cardInstance.cardGroup = index
            cardInstance.style.opacity = '1'
            // setTimeout(() => {
            //     cardInstance.style.opacity = '1'
            // }, cardIndex * index * 30);
        })
        mainBlock.appendChild(cardBlock)
    })

}

    const creatCard = (num) => {
        const cardName = transSuits(num)
        const card = document.createElement('div')
        const img = new Image();
        const path = require(`./images/${cardName}.png`)
        img.src = path
        card.appendChild(img)
        card.id = cardName
        card.classList.add('poker-card')
        return card
    }


// const creatCard = (num) => {
//     const cardName = transSuits(num)
//     const card = new Image();
//     const path = require(`./images/${cardName}.png`)
//     card.src = path
//     card.id = cardName
//     card.classList.add('poker-card')
//     return card
// }

//轉換對應花色
const transSuits = (num) => {
    let color = ''
    switch (true) {
        case num >= 1 && num <= 13:
            color = 'S' //黑桃
            break;
        case num >= 14 && num <= 26:
            color = 'H' //紅心
            break;
        case num >= 27 && num <= 39:
            color = 'D' //方塊
            break;
        default:
            color = 'C' //梅花
            break;
    }
    return `${color + transJQK(num % 13)}`
}

const transJQK = (num) => {
    const order = num.toString()
    const compare = {
        '0': 'K',
        '1': 'A',
        '12': 'Q',
        '11': 'J',
    }
    if (!compare.hasOwnProperty(order)) return order
    return compare[order]
}

//創建上方牌組區
const tempDeckContainer = document.getElementById('temp-card')
const createTempDeck = () => {
    Array.from(new Array(8)).forEach((block, index) => {
        const tempDeckHtml = document.createElement('div')
        tempDeckHtml.classList.add('card-temp-zone')
        tempDeckHtml.droppable = true
        if (index <= 3) {
            tempDeckHtml.id = `card-temp-zone_${index}`
            tempDeckHtml.cardGroup = index
            if (tempDeck[index]) {
                const cardNum = tempDeck[index]
                if (!isGamePause) {
                    // tempDeckHtml.draggable = true
                }
                tempDeckHtml.cardNumber = cardNum
                const card = creatCard(cardNum)
                tempDeckHtml.appendChild(card)
            }
        } else {
            const doneIndex = index % 4
            tempDeckHtml.id = `card-done-zone_${doneIndex}`
            const [cardNum] = successDeck[doneIndex].slice(-1)
            if (!isGamePause) {
                tempDeckHtml.draggable = true
            }
            tempDeckHtml.classList.add('card-done-zone')
            tempDeckHtml.cardNumber = cardNum
            tempDeckHtml.cardGroup = doneIndex
            let card = null
            if (cardNum) {
                card = creatCard(cardNum)
                tempDeckHtml.appendChild(card)
            }
        }
        tempDeckContainer.appendChild(tempDeckHtml)
    })
}


const gameStart = () => {
    createDecks()
    createTempDeck()
}

gameStart()

//拖曳事件
const dragStart = e => {
    // e.defaultPrevented
    if (isGamePause) return
    payload = e.target
    // if(e.target.id === 'main-card') return;
    onDragDeckNumber = e.target.cardGroup
    onDragNumber = e.target.cardNumber
    if ([onDragNumber] === mainDeck[onDragDeckNumber].slice(-1)) {
        e.target.style.backgroundColor = 'rgba(110,110,100,1)'
    }
}

const dragEnter = e => {
    e.defaultPrevented
    console.log('dragEnter');
    if (e.target.id.indexOf('card-temp-zone') > -1) isCacheDeck = true
    if (e.target.id.indexOf('card-done-zone') > -1) isSuccessDeck = true
    if (e.target.id === 'main-card') return;
    if (!e.target.cardNumber) return
    onDropDeckNumber = e.target.cardGroup
    onDropNumber = e.target.cardNumber
    if (onDragNumber === onDropNumber) return //對象為自己
}

const dragLeave = e => {
    e.defaultPrevented
    if (e.target.id.indexOf('wrapper') > -1) {
        isCacheDeck = false
        isSuccessDeck = false
    }
    if (e.target.id.indexOf('card-temp-zone') > -1) {
        isCacheDeck = true
        isSuccessDeck = false
        cacheDeckNumber = e.target.cardGroup
    }
    if (e.target.id.indexOf('card-done-zone') > -1) {
        isSuccessDeck = true
        isCacheDeck = false
        cacheDeckNumber = e.target.cardGroup
    }
}

const dragEnd = e => {
    e.defaultPrevented
    if (isGamePause) return
    // const isCardDoneZone = e.target.id.indexOf('card-done-zone') > -1
    // if(isCardDoneZone) return
    console.log('e',e.target);
    console.log('cacheDeckNumber', cacheDeckNumber);
    // 暫存區
    if (isCacheDeck) {
        dragTempDeck(e)
    }
    //完成區
    if (isSuccessDeck) {
        dragSuccessDeck(e)
    }
    if (!isSuccessDeck && !isCacheDeck) {
        const drapCardNum = Math.ceil(onDragNumber / 13)
        const dropCardNum = Math.ceil(onDragNumber / 13)
        //確認卡片是否有效移動
        const vaildMoveCard = dropCardNum !== drapCardNum && //花色相同
            dropCardNum + drapCardNum !== 5 && //黑桃不能對梅花 方塊不能對愛心
            (onDropNumber % 13 === (onDropNumber % 13) + 1 ||
            (onDropNumber % 13 === 0 && onDragNumber % 13 === 12))
        const isCacheCardDeck = e.target.id.indexOf('card-temp-zone') > -1
        if (isCacheCardDeck && vaildMoveCard) { //從暫存區搬回來
                const cardTempNumber = e.target.id.split('-')[2]
                mainDeck[onDragDeckNumber].push(onDragNumber)
                tempDeck[cardTempNumber].pop()
                reDraw()
                return
        }
        if (
            [onDragNumber] !== mainDeck[onDragDeckNumber].slice(-1) ||
            [onDragNumber] !== mainDeck[onDragDeckNumber].slice(-1)
        ) {
            isCacheDeck = false
            isSuccessDeck = false
            return
        }
        if (vaildMoveCard) {
            dragMainDeck(e)
        }
    }
}

const drop = ()  => {
    // e.defaultPrevented
    e.preventDefault()
    if (isGamePause) return
    // const isCardDoneZone = e.target.id.indexOf('card-done-zone') > -1
    // if(isCardDoneZone) return
    console.log('e', e.target);
    console.log('cacheDeckNumber', cacheDeckNumber);
    // 暫存區
    if (isCacheDeck) {
        dragTempDeck(e)
    }
    //完成區
    if (isSuccessDeck) {
        dragSuccessDeck(e)
    }
    if (!isSuccessDeck && !isCacheDeck) {
        const drapCardNum = Math.ceil(onDragNumber / 13)
        const dropCardNum = Math.ceil(onDragNumber / 13)
        //確認卡片是否有效移動
        const vaildMoveCard = dropCardNum !== drapCardNum && //花色相同
            dropCardNum + drapCardNum !== 5 && //黑桃不能對梅花 方塊不能對愛心
            (onDropNumber % 13 === (onDropNumber % 13) + 1 ||
                (onDropNumber % 13 === 0 && onDragNumber % 13 === 12))
        const isCacheCardDeck = e.target.id.indexOf('card-temp-zone') > -1
        if (isCacheCardDeck && vaildMoveCard) { //從暫存區搬回來
            const cardTempNumber = e.target.id.split('-')[2]
            mainDeck[onDragDeckNumber].push(onDragNumber)
            tempDeck[cardTempNumber].pop()
            reDraw()
            return
        }
        if (
            [onDragNumber] !== mainDeck[onDragDeckNumber].slice(-1) ||
            [onDragNumber] !== mainDeck[onDragDeckNumber].slice(-1)
        ) {
            isCacheDeck = false
            isSuccessDeck = false
            return
        }
        if (vaildMoveCard) {
            dragMainDeck(e)
        }
    }
}


const dragTempDeck = (e) =>{
    if (tempDeck[cacheDeckNumber]) return
    insertHtml(e)
    recordDeck.push({
        from: {
            groupNumber: onDragDeckNumber,
            cardNumber: onDragNumber
        },
        to: {
            groupNumber: cacheDeckNumber,
            cardNumber: onDragNumber
        },
        action: 'toCacheDeck'
    })
    mainDeck[onDragDeckNumber].pop()
    tempDeck[cacheDeckNumber] = onDragNumber
    isCacheDeck = false
}
 
const dragSuccessDeck = () =>{
    if (onDragNumber !== successDeck[cacheDeckNumber].slice(-1)) return
    recordDeck.push({
        from: {
            groupNumber: onDragDeckNumber,
            cardNumber: onDragNumber
        },
        to: {
            groupNumber: cacheDeckNumber,
            cardNumber: onDragNumber
        },
        action: 'toSuccessDeck'
    })
    mainDeck[onDragDeckNumber].pop()
    successDeck[cacheDeckNumber].push(onDragNumber)
    insertHtml(e)
    isSuccessDeck = false
}


const dragMainDeck = () =>{
    recordDeck.push({
        from: {
            groupNumber: onDragDeckNumber,
            cardNumber: onDragNumber
        },
        to: {
            groupNumber: onDropDeckNumber,
            cardNumber: onDragNumber
        },
        action: 'toMain'
    })
    mainDeck[onDragDeckNumber].pop()
    mainDeck[onDropDeckNumber].push(onDragNumber)
    insertHtml(e)
}


const insertHtml = (event) =>{
    console.log('event.target', event.target);
    console.log('payload', payload);
    payload.parentNode.removeChild(payload);
    event.target.appendChild(payload);
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
// wrapper.addEventListener('dragend', dragEnd)
wrapper.addEventListener('drop', drop, false)

const recordMove = (type) => {
    recordDeck.push({
        from: {
            groupNumber: onDragDeckNumber,
            cardNumber: onDragNumber
        },
        to: {
            groupNumber: cacheDeckNumber,
            cardNumber: onDragNumber
        },
        action: type
    })
}

const reDraw = () => {
    mainBlock.innerHTML = ''
    tempDeckContainer.innerHTML = ''
    createDecks()
    createTempDeck()
}


const pause = () => {
    if (isGamePause) {
        btn.textContent = 'Play'
        clearInterval(timer)
        isGamePause = false
        console.log('11111')
    } else {
        btn.textContent = 'Pause'
        countDown()
        reDraw()
        isGamePause = true
        console.log('22222')
    }
}
const btn = document.getElementById('play-btn')
btn.addEventListener('click', pause)

let timer = null
let initTime = 0
const timeContainer = document.getElementById('time')
//計時器
const countDown = () => {
    timer = setInterval(() => {
        initTime++
        const mm = Math.floor(Math.floor(initTime % 3600) / 60)
        const ss = initTime % 60
        timeContainer.textContent = `${transTime(mm)}:${transTime(ss)}`
    }, 1000);
}

const transTime = (num) => {
    if (num < 10) return '0' + num
    return num
}

const undo = () => {
    if (recordDeck.length === 0) return
    const lastStep = recordDeck.pop()
    if (lastStep.action === 'toMain') {
        mainDeck[lastStep.to.groupNumber].pop()
        mainDeck[lastStep.from.groupNumber].push(
            lastStep.from.cardNumber
        )
    } else if (lastStep.action === 'toCacheDeck') {
        tempDeck[lastStep.to.groupNumber].pop()
        mainDeck[lastStep.from.groupNumber].push(
            lastStep.from.cardNumber
        )
    } else if (lastStep.action === 'toSuccessDeck') {
        successDeck[lastStep.to.groupNumber].pop()
        mainDeck[lastStep.from.groupNumber].push(
            lastStep.from.cardNumber
        )
    }
    reDraw()
}

const reset = () => {
    clearInterval(timer)
    timer = null
    isCacheDeck = false
    cacheDeckNumber = null
    isSuccessDeck = false
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