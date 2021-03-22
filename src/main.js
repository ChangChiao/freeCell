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
    cacheDeckNumber = null,
    // isSuccessDeck = false,
    isGamePause = false; //遊戲是否為暫停狀態
    
    
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
const createMainDecks = () => {
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
            setTimeout(() => {
                cardInstance.style.opacity = '1'
            }, cardIndex * index * 30);
        })
        mainBlock.appendChild(cardBlock)
    })

}

//創建上方牌組區
const createTempDeck = () => {
    Array.from(new Array(8)).forEach((block, index) => {
        const tempDeckHtml = document.createElement('div')
        tempDeckHtml.classList.add('card-temp-zone')
        tempDeckHtml.droppable = true
        if (index <= 3) { //暫存區
            tempDeckHtml.id = `card-temp-zone_${index}`
            tempDeckHtml.cardGroup = index
            // if (tempDeck[index]) {
            //     const cardNum = tempDeck[index]
            //     if (!isGamePause) {
            //         tempDeckHtml.draggable = true
            //     }
            //     tempDeckHtml.cardNumber = cardNum
            //     const card = Card.creatSingleCard(cardNum)
            //     tempDeckHtml.appendChild(card)
            // }
        } else {
            const doneIndex = index % 4
            tempDeckHtml.id = `card-done-zone_${doneIndex}`
            const [cardNum] = successDeck[doneIndex].slice(-1) //取最後一個
            if (!isGamePause) {
                tempDeckHtml.draggable = true
            }
            tempDeckHtml.classList.add('card-done-zone')
            tempDeckHtml.cardNumber = cardNum
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


const gameStart = () => {
    createMainDecks() 
    createTempDeck()
}

gameStart()

//拖曳事件
const dragStart = e => {
    if (isGamePause) return
    payload = e.target
    onDragDeckNumber = e.target.cardGroup
    onDragNumber = e.target.cardNumber
    onDragId = e.target.id
    if ([onDragNumber] === mainDeck[onDragDeckNumber].slice(-1)) {
        // e.target.style.opacity = .5;
    }
}

const dragEnter = e => {
    e.preventDefault();
    console.log('dragEnter');
    if (!e.target.cardNumber) return
    // if (onDragNumber === onDropNumber) return //對象為自己
}

const dragLeave = e => {
    e.preventDefault();
    console.log('dragLeave', e.target);
}


const dragOver = e => {
    e.preventDefault();
}

const drop = e => {
    e.preventDefault()
    if (isGamePause) return
    
    const isSingle = payload.children.length === 1
    const isDone = e.target.parentNode.className.includes('card-done-zone')
    // 暫存區
    if (e.target.id.includes('card-temp-zone') && isSingle) {
        cacheDeckNumber = e.target.cardGroup
        dragTempDeck(e)
        return
    }
    onDropDeckNumber = e.target.cardGroup
    onDropNumber = e.target.cardNumber
    //判斷花色用
    const drapCardNum = Math.ceil(onDragNumber / 13)
    const dropCardNum = Math.ceil(onDropNumber / 13)
    console.log('dropCardNum', dropCardNum, onDropNumber);
    console.log('drapCardNum', drapCardNum, onDragNumber);
    
    
    //完成區
    console.log('e.target.id',e.target.id)
    if (e.target.className.includes('poker-card') && isDone && isSingle) {
        console.log('success');
        if (dropCardNum === drapCardNum && onDropNumber % 13 === (onDragNumber % 13) - 1 ) {
                cacheDeckNumber = e.target.parentNode.cardGroup
                console.log('cacheDeckNumber',cacheDeckNumber);
                dragSuccessDeck(e)
        }
        return
    }

    //比對數字是否依序
    let condition = (onDropNumber % 13 === (onDragNumber % 13) + 1 ||
    (onDropNumber % 13 === 0 && onDragNumber % 13 === 12))

    if (e.target.className.includes('poker-card')) {
        console.log('poker-card');
        //確認卡片是否有效移動
        const vaildMoveCard = dropCardNum !== drapCardNum && //花色相同
            dropCardNum + drapCardNum !== 5 && condition //黑桃不能對梅花 方塊不能對愛心
            
        console.log('condition',condition)
        console.log('vaildMoveCard', vaildMoveCard);
        const isCacheCardDeck = e.target.id.indexOf('card-temp-zone') > -1
        if (isCacheCardDeck && vaildMoveCard) { //從暫存區搬回來
            const cardTempNumber = e.target.id.split('-')[2]
            mainDeck[onDragDeckNumber].push(onDragNumber)
            tempDeck[cardTempNumber].pop()
            reDraw()
            return
        }

        if (vaildMoveCard) {
            console.log('vaild');
            dragMainDeck(e)
        }
    }
}


const dragTempDeck = (e) => {
    if (tempDeck[cacheDeckNumber]) return
    const pathObj = {
        from: onDragDeckNumber,
        to: cacheDeckNumber,
        cardNumber: payload.id,
        action: 'toTemp'
    }
    recordDeck.push(pathObj)
    mainDeck[onDragDeckNumber].pop()
    tempDeck[cacheDeckNumber] = onDragNumber
    insertHtml(e)
    setDragable()
}

const dragSuccessDeck = e => {
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
    payload.draggable = false
    insertHtml(e)
    setDragable()
}


const dragMainDeck = e => {
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
    setDragable()
}


const insertHtml = event => {
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
wrapper.addEventListener('dragover', dragOver)
// wrapper.addEventListener('dragend', dragEnd)
wrapper.addEventListener('drop', drop, false)

const recordMove = (type) => {
    const pathObj = {
        from: onDragDeckNumber,
        to: cacheDeckNumber,
        cardNumber: onDragNumber,
        action: type
    }
    recordDeck.push(pathObj)
}

const reDraw = () => {
    mainBlock.innerHTML = ''
    tempDeckContainer.innerHTML = ''
    createMainDecks()
    createTempDeck()
}

//判斷哪張牌可被拖曳
const setDragable = () => {
    const cols = document.getElementsByClassName('card-col')
    for (let i = 0; i < cols.length; i++) {
        const lastOne = cols[i].lastChild
        console.log('lastOne', lastOne);
        lastOne.draggable = true
        if (lastOne.children.length > 1) { //有連續牌
            lastOne.children[lastOne.children.length - 1].draggable = true
        }
    }

}

const pause = () => {
    if (isGamePause) {
        btn.textContent = 'Play'
        Timer.cleanTimer()
        console.log('11111')
    } else {
        btn.textContent = 'Pause'
        Timer.countDown()
        reDraw()
        console.log('22222')
    }
    isGamePause = !isGamePause
}
const btn = document.getElementById('play-btn')
btn.addEventListener('click', pause)


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