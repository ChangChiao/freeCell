
//建立1-52張牌
const pokerArr = Array(52).fill(0).map((item, index) => {
    return index + 1;
});

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


//打亂
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let k = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[k]] = [arr[k], arr[i]];
    }
    return arr;
};

//發牌
export const distributeCard = (mainDeck) => {
    const randomNum = Math.floor(Math.random() * 8);
    if (randomNum <= 3) {
        if (mainDeck[randomNum].length >= 6) {
            return distributeCard(mainDeck)
        }
    } else {
        if (mainDeck[randomNum].length >= 5) {
            return distributeCard(mainDeck)
        }
    }
    return randomNum
};


export const creatSingleCard = (num) => {
    const cardName = transSuits(num)
    const card = document.createElement('div')
    const img = new Image();
    const path = require(`../images/${cardName}.png`)
    img.src = path
    card.appendChild(img)
    card.id = cardName
    card.droppable = true
    card.classList.add('poker-card')
    return card
}



export const createPokerCard = () => {
    return shuffle(pokerArr)
}