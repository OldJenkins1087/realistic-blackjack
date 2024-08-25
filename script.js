
const elements = {
    buttons: {
        instructions: document.querySelector("#infoBtn"),
        graph: document.querySelector("#graphBtn"),
        loans: document.querySelector("#loanBtn"),
        play: document.querySelector("#betBtn"),
        resetBtn: document.querySelector("#rstBtn"),

        payLoan: document.querySelector("#payLoanBtn"),
        closeGraph: document.querySelector(".graphDisplay button"),

        hitBtn: document.querySelector("#hitBtn"),
        standBtn: document.querySelector("#standBtn"),
        dblBtn: document.querySelector("#dblBtn"),
        spltBtn: document.querySelector("#spltBtn"),
        
        riskBtn: document.querySelector("#riskBtn"),
        safeBtn: document.querySelector("#safeBtn")
    },
    texts: {
        instructions: document.querySelector(".info"),
        moneyStat: document.querySelector("#money"),
        loansStat: document.querySelector("#loans"),
        winLossRatio: document.querySelector("#winLossRatio"),
        gameStatus: document.querySelector("#gameStatus"),
        roundStatus: document.querySelector("#roundStatus"),
        dealerScore: document.querySelector("#dealerScore"),
        playerScores: [],

        loanPayment: document.querySelector(".pay-loan > p#payment"),
        loanAmmounts: document.querySelector(".pay-loan > p#numLoans"),
        loanErrors: document.querySelector(".pay-loan > p#Error")
    },
    inputs: {
        betInput: document.querySelector("#betInput")
    },
    hands: {
        dealerHand: document.querySelector(".dealer-hand"), // Dealer Hand
        playerHandsContainer: document.querySelector(".player-hands"),
        playerHands: [],
        playerCardsContainers: [], // Card containers for each hand
        dealerHandCardsContainer: document.querySelector(".dealer-hand > div.cards-container"), // Dealers card container
        currentHandTxts: []
    },
    sections: {
        preGame: document.querySelector(".home-page"),
        postGame: document.querySelector(".running-game"),
        payLoan: document.querySelector(".pay-loan"),
        graph: document.querySelector(".graphDisplay"),
        postGameButtons: document.querySelector("#game-controls"),
        blackjackButtons: document.querySelector("#blackjack-controls")
    },
    colors: {
        green: "rgb(30, 130, 0)",
        red: "rgb(130, 0, 0)",
        yellow: "rgb(130, 130, 0)"
    },
    graph: document.querySelector("#myChart")
}
elements.graphCTX = elements.graph.getContext('2d');
const setMaxBet = () => elements.inputs.betInput.value = (game.money % 2 === 0) ? game.money.toString() : (game.money - 1).toString();
const keybinds = {
    49: hit,
    50: stand,
    51: doubleDown,
    52: split,
    13: start_round,
    77: setMaxBet

}

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.img_path = `Images/${this.value}${this.suit}.png`
    }
}
const suits = ["S", "H", "C", "D"]
const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const cardsValues = {
    "A": 11,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10
};
const card_back_path = "Images/card-back.png";
function checkCard(card) {
    card = (card.value !== undefined) ? String(card.value) : String(card);
    return cardsValues[card];
}
function checkHand(hand, dealer = false) {
    let handSum = 0;
    let aces = 0;

    hand.forEach((x) => {
        x = (x.value !== undefined) ? String(x.value) : String(x);
        if (x.toUpperCase() === 'A') {
            aces += 1;
        }
        handSum += checkCard(x);
    });

    if (!dealer) {
        while (aces > 0 && handSum > 21) {
            handSum -= 10;
            aces -= 1;
        }
    } else {
        while (aces > 0 && !(handSum === 21 && hand.length === 2)) {
            handSum -= 10;
            aces -= 1;
        }
    }

    return handSum;
}
function create_card_elem(imgPath, numCard=0) {
    // Create the main card div and set its classes and style
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.style.setProperty('--i', numCard.toString());

    // Create the card-inner div and set its class
    const cardInnerDiv = document.createElement('div');
    cardInnerDiv.className = 'card-inner';

    // Create the card-front div, its image element and set their classes
    const cardFrontDiv = document.createElement('div');
    cardFrontDiv.className = 'card-front';
    const cardFrontImg = document.createElement('img');
    cardFrontImg.src = imgPath;
    cardFrontImg.alt = 'Card Front';
    cardFrontImg.className = 'card-img';
    cardFrontDiv.appendChild(cardFrontImg);

    // Create the card-back div, its image element and set their classes
    const cardBackDiv = document.createElement('div');
    cardBackDiv.className = 'card-back';
    const cardBackImg = document.createElement('img');
    cardBackImg.src = card_back_path;
    cardBackImg.alt = 'Card Back';
    cardBackImg.className = 'card-img';
    cardBackDiv.appendChild(cardBackImg);

    // Assemble the card
    cardInnerDiv.appendChild(cardFrontDiv);
    cardInnerDiv.appendChild(cardBackDiv);
    cardDiv.appendChild(cardInnerDiv);

    // cardDiv.addEventListener("click", function() { // REMEBER TO REMOVE LATER
    //   cardInnerDiv.classList.toggle('flipped');
    // });
    return cardDiv;
}
function create_player_card_container_elm() {
    const div = document.createElement('div');
    div.className = 'player-hand hand';

    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'scoreContainer';
    const playerHandTxt = document.createElement('h2');
    playerHandTxt.textContent = "Player Hand:";
    const scoreHandTxt = document.createElement('h4');
    scoreHandTxt.id = "playerScore";
    scoreHandTxt.className = "scoreTxts";
    scoreHandTxt.textContent = "Score: 0";
    const currentHandTxt = document.createElement('h2');
    currentHandTxt.id = "currentHand";
    currentHandTxt.textContent = "Current Hand";
    currentHandTxt.style.opacity = "0";
    scoreDiv.appendChild(playerHandTxt);
    scoreDiv.appendChild(currentHandTxt);
    scoreDiv.appendChild(scoreHandTxt);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';

    div.appendChild(scoreDiv);
    div.appendChild(cardsContainer);
    
    elements.hands.playerHands.push(div);
    elements.texts.playerScores.push(scoreHandTxt);
    elements.hands.playerHandsContainer.appendChild(div);
    elements.hands.playerCardsContainers.push(cardsContainer);
    elements.hands.currentHandTxts.push(currentHandTxt);
}
// Functions for game logic
function generateSingleDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of cards) {
            deck.push(new Card(suit, value));
        }
    }
    return deck;
}
function shuffle(l) {
for (let i = 0; i < l.length; i++) {
    let j = Math.floor(Math.random() * l.length);
    let temp = l[i];
    l[i] = l[j];
    l[j] = temp;
}
return l;
}
function randomSplitDeck(deck, minPercentage = 0.75) {
    const minIndex = Math.floor(deck.length * minPercentage);
    const cutIndex = Math.floor(Math.random() * (deck.length - minIndex)) + minIndex;
    return shuffle(deck.slice(0, cutIndex));
}
function generateNumDecks(num_of_decks) {
    let deck = [];
    for (let i = 0; i < num_of_decks; i++) {
        deck = deck.concat(generateSingleDeck());
    }
    // Return the shuffled deck
    return randomSplitDeck(shuffle(deck));
}
function flip_card(card_elem) {
    card_elem.children[0].classList.toggle("flipped");
}
function remove_hand_cards(hand) {
    while (hand.firstChild) {
        hand.removeChild(hand.firstChild);
    }
}
function clear_hand_cards() {
    elements.hands.playerHands.forEach((hand) => hand.remove());
    remove_hand_cards(elements.hands.dealerHandCardsContainer)
}
function draw_hand_cards() {
    elements.hands.playerCardsContainers.forEach((container, i) => {
        remove_hand_cards(container);
        elements.texts.playerScores[i].innerText = `Score: ${checkHand(game.player_hands[i])}`;
        game.player_hands[i].forEach((c,ci) => {
            game.player_hands[i][ci].elm.style.setProperty("--i", ci.toString());
            container.appendChild(game.player_hands[i][ci].elm);
            if (game.current_hand !== i) {
                elements.hands.currentHandTxts[i].style.opacity = "0";
            } else {
                elements.hands.currentHandTxts[i].style.opacity = "1";
            }
        })
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

infoBtn.addEventListener("click", () => {
    if (info.style.display === "none") {
        info.style.display = "block";
    } else {
        info.style.display = "none";
    }
});

var game = {}
function reset_game() {
    game.deck = generateNumDecks(8);
    game.playing_round = false;
    game.num_operations = 1;
    game.player_scores = [];
    game.game_data = [];
    game.money = 100;
    game.losses = 0;
    game.roundN = 0;
    game.loans = [];
    game.wins = 0;
    game.bet = 0;
    reset_round();
}

function reset_round() {
    clear_hand_cards();
    elements.sections.postGame.style.display = "none";
    elements.buttons.dblBtn.style.display = "block";
    elements.sections.preGame.style.display = "";
    elements.texts.roundStatus.style.opacity = 1;
    elements.texts.gameStatus.style.opacity = 0;
    elements.hands.playerCardsContainers = [];
    elements.texts.gameStatus.innerText = "";
    elements.hands.currentHandTxts = [];
    elements.texts.playerScores = [];
    elements.texts.playerScores = [];
    elements.hands.playerHands = [];
    game.playing_round = false;
    game.dbled_down_hands = [];
    game.blackjack_hands = [];
    game.splitting_hands = [];
    game.player_scores = [];
    game.num_operations = 1;
    game.player_hands = [];
    game.dealer_cards = [];
    game.dealer_score = 0;
    game.current_hand = 0;
    game.standing = false;
    updateStats();
    game.roundN++;
    if (game.roundN > 0) saveGame();
    // elements.sections.preGame.style.display = "none";
}

elements.buttons.instructions.addEventListener("click", () => {
    elements.texts.instructions.style.display = (elements.texts.instructions.style.display == "none") ? "block" : "none";
})
function updateStats() {
    game.winLossRatio = 0;
    try {game.winLossRatio = (game.losses == 0) ? game.wins : (game.wins / game.losses).toFixed(2);} catch (e) {game.winLossRatio = 0;}
    try {game.money.toString();} catch (e) {game.money = 100;}
    try {game.loans.toString();} catch (e) {game.loans = [];}
    elements.texts.moneyStat.innerHTML = `Money: ${game.money}`;
    elements.texts.loansStat.innerHTML = `Loans: ${game.loans.length}`;
    elements.texts.winLossRatio.innerHTML = `Win/Loss Ratio: ${game.winLossRatio}`
}

function update_scores() {
    elements.texts.dealerScore.innerText = `Score: ${game.dealer_score}`
    for (let i = 0; i < game.player_hands.length; i++) {
        elements.texts.playerScores[i].innerText = `Score: ${game.player_scores[i]}`
    }
}
async function start_round() {
    if (game.playing_round) return;
    if (game.deck.length < 8) {
        game.deck = generateNumDecks(8);
        console.log("reshuffling deck");
    }
    if (game.money < 1) {
        elements.texts.roundStatus.innerText = "Grabbed a loan ;(";
        elements.texts.roundStatus.style.color = elements.colors.red;
        game.money += 100;
        game.loans.push(game.roundN);
        updateStats();
        return;
    }
    if (elements.inputs.betInput.value != "") {
        game.bet = parseInt(elements.inputs.betInput.value);
    }
    if (game.bet%2 !== 0 || game.bet === 0) {
        elements.texts.roundStatus.innerText = "Enter an even bet and press return to start!";
        elements.texts.roundStatus.style.color = elements.colors.yellow;
        return;
    }
    if (game.bet > game.money) {
        elements.texts.roundStatus.innerText = "Not enough money!";
        elements.texts.roundStatus.style.color = elements.colors.red;
        
        return;
    }
    elements.sections.preGame.style.display = "none";
    elements.sections.postGame.style.display = "block";
    elements.texts.gameStatus.style.opacity = 1;
    elements.texts.roundStatus.style.opacity = 0;
    create_player_card_container_elm();
    elements.hands.currentHandTxts[0].style.opacity = 1;
    start_cards = [];
    for (let i = 0; i < 4; i++) {
        let card = game.deck.splice(0,1)[0];
        card.elm = create_card_elem(card.img_path, i);
        if (i === 0) flip_card(card.elm)
        start_cards.push(card);
    }
    game.dealer_cards = [start_cards[0], start_cards[2]];
    game.player_hands = [[start_cards[1], start_cards[3]]];
    // console.log(game.dealer_cards[1])
    // console.log(game.player_hands[0][1])
    for ( let i = 0; i < 2; i++) {
        player_card = game.player_hands[0][i];
        dealer_card = game.dealer_cards[i];
        player_card.elm.style.setProperty("--i", i.toString());
        dealer_card.elm.style.setProperty("--i", i.toString());
        elements.hands.dealerHandCardsContainer.appendChild(dealer_card.elm);
        elements.hands.playerCardsContainers[0].appendChild(player_card.elm);
    }
    game.player_scores = [checkHand(game.player_hands[0])];
    game.dealer_score = checkHand(game.dealer_cards);
    update_scores();

    game.playing_round = true;

    if (game.player_scores[0] === 21 && game.dealer_score === 21) {
        flip_card(game.dealer_cards[0].elm);
        elements.texts.gameStatus.innerText = "Push! Double Blackjacks";
        elements.texts.roundStatus.style.color = elements.colors.yellow;
        elements.texts.gameStatus.style.color = elements.colors.yellow;
        elements.texts.roundStatus.innerText = "Push! on blackjacks ;(";
        sleep(500).then(reset_round);
    }
    if (game.player_scores[0] === 21) {
        elements.texts.roundStatus.innerText = `Player wins ${game.bet*1.5}!`;
        elements.texts.gameStatus.innerText = "Player has blackjack! Player has blackjack!";
        elements.texts.roundStatus.style.color = elements.colors.green;
        elements.texts.gameStatus.style.color = elements.colors.green;
        game.money += game.bet * 1.5;
        game.playing_round = false;
        game.wins++;
        sleep(500).then(reset_round)
    } else if (game.dealer_score === 21) {
        flip_card(game.dealer_cards[0].elm);
        elements.texts.roundStatus.innerText = `Player looses ${game.bet}! Dealer has blackjack.`;
        elements.texts.gameStatus.innerText = "Dealer has blackjack!";
        elements.texts.roundStatus.style.color = elements.colors.red;
        elements.texts.gameStatus.style.color = elements.colors.red;
        game.money -= game.bet;
        game.playing_round = false;
        game.losses++;
        sleep(500).then(reset_round)
    }
    if (checkCard(game.player_hands[0][0]) === checkCard(game.player_hands[0][1])) {
        elements.buttons.spltBtn.style.display = "block";
    } else {
        elements.buttons.spltBtn.style.display = "none";
    }

    game.dealer_score = checkCard(game.dealer_cards[1]);
    update_scores();
}
elements.buttons.play.addEventListener("click", start_round);
document.addEventListener("keydown", (e) => {
    if (keybinds.hasOwnProperty(e.keyCode)) {
        keybinds[e.keyCode]();
    }
})

function play_next_hand() {
    if (game.player_hands.length > game.current_hand+1) {
        elements.hands.currentHandTxts[game.current_hand].style.opacity = 0;
        game.current_hand++;
        if (game.player_hands[game.current_hand].length === 1) {
            hit();
        }
        elements.hands.currentHandTxts[game.current_hand].style.opacity = 1;
        if (game.player_scores[game.current_hand] === 21) {
            elements.texts.gameStatus.innerText = "Player has blackjack!";
            game.blackjack_hands.push(game.current_hand);
            stand();
        } else if (checkCard(game.player_hands[game.current_hand][0]) === checkCard(game.player_hands[game.current_hand][1]) && game.player_hands.length <= 4) {
            elements.buttons.spltBtn.style.display = "block";
        } else if (!checkCard(game.player_hands[game.current_hand][0]) === checkCard(game.player_hands[game.current_hand][1]) || game.player_hands.length > 4) {
            elements.buttons.spltBtn.style.display = "none";
        } else {
            elements.buttons.dblBtn.style.display = "block";
        }
        return true;
    }
    return false;
}
async function hit() {
    if (!game.playing_round) return;
    if (game.deck.length <= 2) {
        game.deck = generateNumDecks(8);
        console.log("reshuffling");
    }
    let card = game.deck.splice(0,1)[0];
    card.elm = create_card_elem(card.img_path, game.player_hands[game.current_hand].length);
    game.player_hands[game.current_hand].push(card);
    draw_hand_cards();
    game.player_scores[game.current_hand] = checkHand(game.player_hands[game.current_hand]);
    update_scores();
    elements.texts.gameStatus.innerText = `Player drew a ${card.value}; ${game.player_scores[game.current_hand]}`;
    elements.texts.gameStatus.style.color = elements.colors.yellow;
    game.num_operations++;
    if (game.player_hands[game.current_hand].length > 2) elements.buttons.dblBtn.style.display = "none";
    if (game.player_scores[game.current_hand] > 21) {
        elements.texts.gameStatus.innerText = "Player busts!";
        elements.texts.gameStatus.style.color = elements.colors.red;
        elements.texts.roundStatus.innerText = "Player busts! Dealer wins!";
        elements.texts.roundStatus.style.color = elements.colors.red;
        game.playing_round = false;
        game.losses++;
        game.money -= (game.dbled_down_hands.includes(game.current_hand) ? game.bet*2 : game.bet);
        if (!play_next_hand()) sleep(500).then(reset_round);
    }
}
elements.buttons.hitBtn.addEventListener("click", hit);

async function doubleDown() {
    if (!game.playing_round || game.player_hands[game.current_hand].length > 2) return;
    if (game.money < game.bet * (game.dbled_down_hands.length + 2 + game.splitting_hands.length)) {
        elements.texts.gameStatus.innerText = "Not enough money!";
        elements.texts.gameStatus.style.color = elements.colors.red;
        elements.buttons.dblBtn.style.display = "none";
        return;
    }
    game.dbled_down_hands.push(game.current_hand);
    elements.texts.gameStatus.innerText = "Player doubled down!";
    elements.texts.gameStatus.style.color = elements.colors.yellow;
    hit()
    sleep(750).then(stand);
}

async function stand() {
    if (!game.playing_round || game.standing) return;
    if (play_next_hand()) return;
    game.standing = true;
    game.playing_round = false;
    let play_dealer = false;
    game.dealer_score = checkHand(game.dealer_cards, true);
    for (let i = 0; i < game.player_hands.length; i++) {
        if (!game.blackjack_hands.includes(i) && game.player_scores[i] <= 21) {
            play_dealer = true;
        }
    }
    flip_card(game.dealer_cards[0].elm);
    if (play_dealer && game.dealer_score < 17) {
        while (game.dealer_score < 17) {
            let card = game.deck.splice(0,1)[0];
            let elm = create_card_elem(card.img_path, game.dealer_cards.length);
            card.elm = elm
            game.dealer_cards.push(card);
            elements.hands.dealerHandCardsContainer.appendChild(elm);
            game.dealer_score = checkHand(game.dealer_cards, true);
            sleep(200);
        }
    }
    update_scores();
    sleep(200);
    let value = 0;
    let losses = 0;
    let wins = 0;
    let pushes = 0;
    for (let i = 0; i < game.player_hands.length; i++) {
        hand = game.player_hands[i];
        score = game.player_scores[i];
        if (game.blackjack_hands.includes(i)) {
            value += game.bet * 1.5;
            wins++;
        } else if (score > 21) {
            losses++;
            value -= (game.dbled_down_hands.includes(i) ? game.bet*2 : game.bet);
        } else if (game.dealer_score > 21) {
            wins++;
            value += (game.dbled_down_hands.includes(i) ? game.bet*2 : game.bet);
        } else if (score > game.dealer_score) {
            value += (game.dbled_down_hands.includes(i) ? game.bet*2 : game.bet);
            wins++;
        } else if (score < game.dealer_score) {
            losses++;
            value -= (game.dbled_down_hands.includes(i) ? game.bet*2 : game.bet);
        } else if (score === game.dealer_score) {
            pushes++;
        }
    }
    game.game_data.push({x: game.roundN, y: game.money});
    game.money += value;
    game.wins += wins;
    game.losses += losses;

    outveMoney = (game.money < 1) ? "<br><br><span class='yellow'>Got A Loan!</span>" : ""
    text = `Player has ${value>0 ? 'won' : 'lost'} ${Math.abs(value)}! ${wins} wins, ${losses} losses, ${pushes} pushes`;
    console.log(text);
    if (outveMoney != "") {
        text += outveMoney;
        game.game_data.push({x: game.roundN, y: game.money});
        game.money += 100;
        game.loans.push(game.roundN);
    }
    elements.texts.gameStatus.innerText = text;
    elements.texts.gameStatus.style.color = value > 0 ? elements.colors.green : elements.colors.red;
    elements.texts.roundStatus.innerHTML = text;
    elements.texts.roundStatus.style.color = value > 0 ? elements.colors.green : elements.colors.red;

    game.game_data.push({ x: game.roundN, y: game.money });
    sleep(3000).then(reset_round)
}
elements.buttons.standBtn.addEventListener("click", stand)

let loaded = loadGame();
console.log(`Loaded: ${loaded}`);

function saveGame() {
    window.localStorage.setItem("gameState", JSON.stringify(game));
  }
function loadGame() {
    let test = JSON.parse(window.localStorage.getItem("gameState"));
    if (test == null) {
        resetGame();
        return false;
    } else {
        game = test;
        updateStats();
        return true;
    }
}

let data = {
    datasets: [{
        label: "Blackjack Stats",
        data: [{x:1, y: 100}],
        pointBackgroundColor: ["#6F6F6F"],
        showline: true,
        fill: false,
        borderColor: 'rgb(75,192,192)',
        tension: 0
    }]
};
let config = {
    type: "line",
    data: data,
    options: {
        scales: {
        x: {
            type: 'linear',
            position: 'bottom'
        }
        }
    }
};
Chart.defaults.color = '#ffffff';
const statsChart = new Chart(elements.graphCTX, config); // Chart is defined from HTML script statements
function displayGraph() {
    if (game.playing_round) return;
    if (elements.sections.postGame.style.display === "block") {
        console.log("Please finish game!");
        return;
    }
    elements.sections.graph.style.display = "block";
    elements.sections.preGame.style.display = "none";
    elements.sections.postGame.style.display = "none";
    elements.texts.roundStatus.style.display = "none";
    statsChart.data.datasets[0].data = game.game_data;
    statsChart.data.datasets[0].pointBackgroundColor = game.game_data.map((p) => p.y <= 1 ? "#F66D50" : "#6F6F6F");
    statsChart.update();
}
elements.buttons.graph.addEventListener("click", displayGraph)
function closeGraph() {
    if (game.playing_round) return;
    elements.sections.graph.style.display = "none";
    elements.sections.preGame.style.display = "block";
    elements.sections.postGame.style.display = "none";
    elements.texts.roundStatus.style.display = "block";
}
elements.buttons.closeGraph.addEventListener("click", closeGraph)
async function pay_loan() {
    if (game.playing_round) return false;
    if (game.loans.length <= 0) {
        elements.sections.payLoan.style.display = "none";
        elements.sections.preGame.style.display = "block";
        return false;
    }
    let first_loan = game.loans[0];
    let payable = true;
    elements.buttons.payLoan.style.display = "none";
    if (first_loan === game.roundN) {
      elements.texts.loanErrors.style.opacity = 1;
      elements.texts.loanErrors.innerText = "You can't pay your loan instantly";
      elements.texts.loanErrors.style.color = elements.colors.yellow;
      payable = false;
      sleep(2000).then(() => elements.texts.loanErrors.style.opacity = 0);
    }
    elements.sections.payLoan.style.display = "block";
    elements.sections.preGame.style.display = "none";
    elements.sections.postGame.style.display = "none";
    elements.texts.roundStatus.style.display = "none";

    elements.texts.loanAmmounts.innerText = `Number of Loans: ${game.loans.length}`;
    if (payable) {
        let payment = 100;
        for (let i=0; i<game.roundN-first_loan; i++) {
          payment = payment + (payment * .025);
        }
        payment = Math.round(payment);
        console.log(`Loan payment = ${payment}`)
        elements.texts.loanPayment.innerText = "First Loans Payment: " + payment.toString();
        if (payment+2 > game.money) {
          elements.buttons.payLoan.style.display = "none";
          payable = false;
          sleep(1000).then(() => {
            elements.texts.loanErrors.style.opacity = 1;
            elements.texts.loanErrors.innerText = "Not enough money to pay loan";
            elements.texts.loanErrors.style.color = elements.colors.yellow;
            sleep(1000).then(() => {
              elements.texts.loanErrors.style.opacity = 0;
              elements.sections.payLoan.style.display = "none";
              elements.sections.preGame.style.display = "block";
            })
          })
        } else {
            elements.buttons.payLoan.style.display = "block";
        }
    }
}
elements.buttons.loans.addEventListener("click", pay_loan);

async function payLoan() {
    if (game.playing_round) return false;
    let first_loan = (game.loans.length > 0) ? game.loans[0] : game.roundN;
    if (first_loan === game.roundN) return false;
    let payment = 100;
    for (let i=0; i<game.roundN-first_loan; i++) {
      payment = payment + (payment * .025);
    }
    payment = Math.round(payment);
    if (payment + 2 > game.money) {
        elements.texts.loanErrors.innerText = "Not enough money to pay loan";
        elements.texts.loanErrors.style.color = elements.colors.yellow;
        elements.texts.loanErrors.style.opacity = 1;
        sleep(1000).then(() => {
            elements.texts.loanErrors.style.opacity = 0;
            elements.sections.payLoan.style.display = "none";
            elements.sections.preGame.style.display = "block";
        });
        return false;
    }
    game.money -= payment
    game.loans.splice(0,1)
    elements.sections.payLoan.style.display = "none";
    elements.sections.preGame.style.display = "block";
    updateStats()
}
elements.buttons.payLoan.addEventListener("click", payLoan);

function resetGame() {
    reset_game();
    game.playing_round = false;
    updateStats();
    elements.sections.preGame.style.display = "block";
    elements.sections.postGame.style.display = "none";
    elements.texts.roundStatus.style.display = "block";
    elements.texts.loanErrors.style.opacity = 0;
    elements.sections.payLoan.style.display = "none";
}
elements.buttons.resetBtn.addEventListener("click", resetGame)
function update_cards() {
    clear_hand_cards
    for (let i=0; i<game.player_hands.length; i++) {
        let hand = game.player_hands[i];
        for (let j=0; j<hand.length; j++) {
            let card = hand[j];
            card.elm = create_card_elem(card.img_path, j);
            
        }
    }
}
function split() {
    if (!game.playing_round || game.player_hands[game.current_hand].length !== 2 || elements.buttons.spltBtn.style.display === "none") return;
    let f = game.player_hands[game.current_hand][0];
    let s = game.player_hands[game.current_hand][1];
    if (game.player_hands.length >= 4) {
        elements.texts.gameStatus.innerText = "Can't split more than 3 times";
        elements.texts.gameStatus.style.color = elements.colors.yellow;
        elements.buttons.spltBtn.style.display = "none";
        return;
    }
    if (game.money < (game.bet * (game.dbled_down_hands.length + game.splitting_hands.length + 2))) {
        elements.texts.gameStatus.innerText = "Not enough money to split";
        elements.texts.gameStatus.style.color = elements.colors.red;
        elements.buttons.spltBtn.style.display = "none";
        return;
    }
    if (checkCard(f) === checkCard(s)) {
        let card = game.deck.splice(0,1)[0];
        card.elm = create_card_elem(card.img_path, 1);

        let hand1 = [f, card];
        let hand2 = [s];
        let hand1_score = checkHand(hand1);
        let hand2_score = checkHand(hand2);
        game.player_hands.splice(0,1)
        game.player_hands = [hand1, hand2].concat(game.player_hands);

        game.player_scores.splice(0,1)
        game.player_scores = [hand1_score, hand2_score].concat(game.player_scores);
        
        game.splitting_hands.push(game.current_hand);

        if (hand1_score == 21) {
            game.blackjack_hands.push(game.current_hand)
            elements.texts.gameStatus.innerText = "Blackjack!";
            elements.texts.gameStatus.style.color = elements.colors.green;
            elements.texts.gameStatus.style.display = "block";

            sleep(500).then(stand);
        } else if (!checkCard(hand1[0]) === checkCard(hand1[1])) {
            elements.buttons.spltBtn.style.display = "none";
        }

        create_player_card_container_elm();
        draw_hand_cards();
    }
}
elements.buttons.spltBtn.addEventListener("click", split);
