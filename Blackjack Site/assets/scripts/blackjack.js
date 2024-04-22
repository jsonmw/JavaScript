// Static methods for manipulating the GUI of the game \\

class Gui {
  // Renders the given string in the game screen

  static renderOutput(...outputs) {
    for (const output of outputs) {
      const newOutput = document.createElement("p");
      newOutput.innerText = output;
      outputScreen.appendChild(newOutput);
      newOutput.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    Gui.renderScore();
    Gui.renderMoney();
    Gui.renderBet();
    Gui.renderStats();
    this.toggleAllGameButtons();
  }

  static renderStats() {
    if (human && human.games > 0) {
      const stats = document.querySelectorAll(".stat-value");
      let itr = 0;
      human.updateStats();
      for (const stat of stats) {
        stat.innerHTML = human.statValues[itr];
        itr++;
      }
    }
  }

  static resetStats() {
    const stats = document.querySelectorAll(".stat-value");

    human.updateStats();
    for (const stat of stats) {
      stat.innerHTML = "-";
    }
  }

  //  Renders score in score boxes

  static renderScore() {
    if (humanScore.hasChildNodes()) {
      humanScore.removeChild(humanScore.firstChild);
    }
    if (jimboScore.hasChildNodes()) {
      jimboScore.removeChild(jimboScore.firstChild);
    }

    let humanOutput = document.createElement("p");
    let jimboOutput = document.createElement("p");
    if (gameOn) {
      humanOutput.innerText = `${activeHand.total}`;
      jimboOutput.innerText = `${jimbo.hands[0].total}`;
    } else {
      humanOutput.innerText = "0";
      jimboOutput.innerText = "0";
    }

    humanScore.appendChild(humanOutput);
    jimboScore.appendChild(jimboOutput);
  }

  // Renders the bet in the current bet screen

  static renderBet() {
    if (human) {
      bjBetEntry.value = `$ ${human.currentBet}`;
    } else {
      bjBetEntry.value = `$${MIN_BET}`;
    }
  }

  //   Renders the funds screen

  static renderMoney() {
    if (currentMoney.hasChildNodes()) {
      currentMoney.removeChild(currentMoney.firstChild);
    }
    let moneyOutput = document.createElement("p");
    if (human) {
      moneyOutput.innerText = `\$ ${human.wallet}`;
    } else {
      moneyOutput.innerText = "$ 0";
    }
    currentMoney.appendChild(moneyOutput);
  }

  // Clears the game output screen

  static clearOutput() {
    outputScreen.innerHTML = "";
  }

  // Enables or disables the input buttons

  static toggleAllGameButtons() {
    Gui.toggleHitButton();
    Gui.toggleStayButton();
    Gui.toggleSplit();
    Gui.toggledDDown();
    Gui.toggleNewPlayerButton();
    Gui.toggleNewGameButton();
    Gui.toggleBetButton();
  }

  // Individual button toggles

  static toggleBetButton() {
    if (gameOn || !human) {
      bjBetButton.classList.add("invisible");
      bjBetEntry.classList.add("bj-bet-saved");
      bjBetEntry.setAttribute("disabled", "disabled");
    } else {
      bjBetButton.classList.remove("invisible");
      bjBetEntry.classList.remove("bj-bet-saved");
      bjBetEntry.removeAttribute("disabled");
    }
  }

  static toggleHitButton() {
    if (gameOn && !human.doubled) {
      hitButton.classList.remove("faded-input");
    } else {
      hitButton.classList.add("faded-input");
    }
  }

  static toggleStayButton() {
    if (gameOn) {
      stayButton.classList.remove("faded-input");
    } else {
      stayButton.classList.add("faded-input");
    }
  }

  static toggleSplit() {
    if (human && human.hands.length > 0 && activeHand.checkSplit()) {
      splitButton.classList.remove("faded-input");
    } else {
      splitButton.classList.add("faded-input");
    }
  }

  static toggledDDown() {
    if (gameOn && human.hands.length > 0 && activeHand.cards.length === 2) {
      ddownButton.classList.remove("faded-input");
      this.canDouble = true;
    } else {
      this.canDouble = false;
      ddownButton.classList.add("faded-input");
    }
  }

  static toggleNewPlayerButton() {
    if (!human) {
      bjNewPlayerButton.classList.remove("faded-input");
    } else {
      bjNewPlayerButton.classList.add("faded-input");
      bjNewGameButton.classList.remove("faded-input");
    }
  }

  static toggleNewGameButton() {
    if (!human || human.wallet < 1) {
      bjNewGameButton.classList.add("faded-input");
    }
    if (gameOn) {
      bjNewGameButton.classList.add("invisible");
      hitButton.classList.remove("invisible");
    } else {
      bjNewGameButton.classList.remove("invisible");
      hitButton.classList.add("invisible");
    }
  }
}

// -------------------UTILITY--------------------- \\

// Global variables

let currentGame;
let currentDeck;
let activeHand;
let human;
let jimbo;
let gameOn = false;

// DOM objects

const playAsker = document.getElementById("ask-to-play");
const playButton = document.getElementById("bj-play");
const textGame = document.getElementById("text-game");
const outputScreen = document.getElementById("computer-player-output");
const bjScores = document.getElementById("bj-scores");
const humanScore = document.getElementById("human-score");
const jimboScore = document.getElementById("jimbo-score");
const currentMoney = document.getElementById("money-box");
const bjBetEntry = document.getElementById("bj-bet-input");
const bjBetButton = document.getElementById("bet-changer");
const playerInput = document.getElementById("human-player-input");
const hitButton = document.getElementById("hit-button");
const stayButton = document.getElementById("stay-button");
const splitButton = document.getElementById("split-button");
const ddownButton = document.getElementById("ddown-button");
const inputButtons = document.querySelectorAll(".bj-input");
const bjNewPlayerButton = document.getElementById("bj-new-player-button");
const bjNewGameButton = document.getElementById("bj-new-game-button");
const bjExitButton = document.getElementById("bj-exit-button");

// statistics targets

const statsTable = document.getElementById("statistics");

// Misc constants

const MAX_VALUE = 21;
const JIMBO_MAX = 17;
const STARTING_FUNDS = 1500;
const MIN_BET = 25;
const SUITS = ["hearts", "spades", "clubs", "diamonds"];
const FACE_CARDS = ["ace", "king", "queen", "jack"];

// Message Constants

const SPACING = `-------------------------------------------
    `;
const GREETING = `Hello, I am Jimbo. Welcome to my Blackjack game.

                Click NEW PLAYER to challenge Jimbo!`;
const CHANGE_BET = `To change your wager, enter a new amount in the CURRENT BET field then click SAVE CHANGES. 
  
  Click NEW GAME to begin!`;
const BET_SUCCESS = `Jimbo scoffs at your new bet of `;
const BET_FAIL = "Jimbo groans audibly -- Try a valid bet!";
const PLAYER_BUST = "You have busted. Great idea to hit, ya goofball!";
const STAY_MESSAGE = "You have stayed. Let's see what our guy Jimbo does!";
const JIMBO_BUST = "Oh no! Jimbo BUSTED! Ah BISCUITS!";
const BLACKJACK = "Very nice! BLACKJACK!";
const GAME_OVER = "The game has ended";
const PLAYER_WINS = `Congratulations! You have defeated Jimbo!`;
const PLAYER_DRAW = `It's tied. Jimbo looks ready for more!`;
const PLAYER_LOSES = `JIMBO IS VICTORIOUS!`;
const JIMBO_INSULT_BROKE =
  "Yeah right pal, you're broke. Jimbo beckons you to the mines!";
const JIMBO_INSULT_DDOWN = `You? Double down? You're too poor!! No one wants to work in the mines anymore!`;
const JIMBO_INSULT_ISF =
  "Jimbo shrieks from deep within the mine! You don't have enough money for that bet!";
const JIMBO_INSULT_MIN_BET = `Jimbo points to a sign on the wall that says, "MINIMUM BET IS $${MIN_BET}".`;

// Event Listeners

bjBetButton.addEventListener("click", betButtonHandler);
playButton.addEventListener("click", playButtonHandler);
hitButton.addEventListener("click", hitButtonHandler);
stayButton.addEventListener("click", stayButtonHandler);
splitButton.addEventListener("click", splitButtonHandler);
ddownButton.addEventListener("click", ddownButtonHandler);
bjExitButton.addEventListener("click", exitButtonHandler);
bjNewGameButton.addEventListener("click", newGameHandler);
bjNewPlayerButton.addEventListener("click", newPlayerHandler);

// -------------------CLASSES--------------------- \\

// Constructs an individual card

class Card {
  constructor(value, suit) {
    this.value = value + 2;
    this.scoredValue = this.adjustValue(this.value);
    this.suit = suit;
    this.dealt = false;
  }

  // Adds one to 0-index and converts to face card string if 10+

  convertFace() {
    let faceValue = this.value;
    if (faceValue > 10) {
      faceValue = FACE_CARDS[14 - faceValue];
    }
    return faceValue;
  }

  adjustValue(value) {
    if (value > 10 && value < 14) {
      return 10;
    } else if (value === 14) {
      return 11;
    } else {
      return value;
    }
  }
}

// holds a deck of 52 cards

class Deck {
  constructor() {
    this.cards = this.shuffle();
  }

  // builds deck and fills with cards

  shuffle() {
    const cards = { hearts: [], spades: [], clubs: [], diamonds: [] };
    for (let suit in cards) {
      for (let i = 0; i < 13; i++) {
        cards[suit].push(new Card(i, suit));
      }
    }

    return cards;
  }

  // returns the card in the current deck with the given value, suit

  getCard(value, suit) {
    suit = SUITS[suit];
    suit = this.cards[suit];
    return suit[value - 2];
  }

  // verifies if the given card in the deck has been dealt.

  isDealt(card) {
    return card.dealt;
  }
}

class Hand {
  constructor(...cards) {
    this.aces = 0;
    this.total = 0;
    this.cards = [...cards];
  }

  checkSplit() {
    return (
      this.cards.length === 2 &&
      this.cards[0].scoredValue === this.cards[1].scoredValue
    );
  }

  calcHandTotal() {
    this.total = 0;
    this.aces = 0;
    for (let card of this.cards) {
      this.total += card.scoredValue;
      if (card.value === 14) {
        this.aces++;
      }
    }

    if (this.total > MAX_VALUE && this.aces > 0) {
      this.total -= 10;
      this.aces--;
    }

    return this.total;
  }
}

// A blackjack player

class Player {
  constructor(name) {
    // game specific

    this.name = name;
    this.total = 0;
    this.hands = [];
    this.finishedHands = [];
    this.handsLeft = 0;
    this.currentBet = MIN_BET;
    this.doubled = false;
    this.cantHit = false;

    // persistent between games

    this.wallet = STARTING_FUNDS;
    this.games = 0;
    this.statValues;

    this.wins = 0;
    this.losses = 0;
    this.ties = 0;
    this.bjs = 0;
    this.jimboBJs = 0;
    this.highestBet = 0;
    this.highestWin = 0;
    this.lowestLoss = 0;
    this.totalWinnings = 0;
    this.totalBets = 0;
    this.totalBusts = 0;
    this.totalSplits = 0;
    this.totalDDs = 0;
  }

  // hits and adds the new card to the running total.

  updateStats() {
    this.statValues = [
      this.wins,
      this.losses,
      ((this.wins / this.games) * 100).toFixed(1) + " %",
      this.ties,
      this.bjs,
      this.jimboBJs,
      this.highestWin,
      this.lowestLoss,
      "$ " + (this.totalWinnings / (this.games - this.ties)).toFixed(0),
      "$ " + this.highestBet,
      "$ " + (this.totalBets / this.games).toFixed(0),
      this.totalWinnings !== 0
        ? ((this.totalWinnings / this.totalBets) * 100).toFixed(1) + " %"
        : "-",
      ((this.bjs / this.games) * 100).toFixed(1) + " %",
      ((this.totalBusts / this.games) * 100).toFixed(1) + " %",
      ((this.totalSplits / this.games) * 100).toFixed(1) + " %",
      ((this.totalDDs / this.games) * 100).toFixed(1) + " %",
    ];
  }

  updateBets(won) {
    this.totalBets += this.currentBet;
    if (this.currentBet > this.highestBet) {
      this.highestBet = this.currentBet;
    }
    if (won) {
      if (this.currentBet > this.highestWin) {
        this.highestWin = this.currentBet;
      }
    } else {
      if (-this.currentBet < this.lowestLoss) {
        this.lowestLoss = -this.currentBet;
      }
    }
  }

  newHand() {
    const newHand = new Hand();
    this.handsLeft++;
    this.hit(newHand);
    this.hit(newHand);
    return newHand;
  }

  finishHand() {
    this.finishedHands.push(this.hands[this.hands.length - 1].pop());

    if (this.hands.length === 0) {
      currentGame.resolveHands();
    }
  }

  hit(givenHand) {
    let success = false;
    let card;

    // draws a random card and plays it if not dealt

    while (!success) {
      const value = Math.floor(Math.random() * 13) + 2; // how to get a random whole number in javascript
      const suit = Math.floor(Math.random() * 4);
      card = currentDeck.getCard(value, suit);
      success = !currentDeck.isDealt(card);

      if (success) {
        givenHand.calcHandTotal();
        card.dealt = true;
        givenHand.cards.push(card);
      }
    }
    return card;
  }

  //   Unfinished

  split() {
    human.totalSplits++;
    const hand2 = new Hand();
    hand2.push(this.hands[this.hands.length - 1].cards[1].pop());
    this.hands.push[hand2];

    // this.hands[this.hands.length-2].cards[0].calculateNewTotal(this.hands[this.hands.length-2]);
    // this.hands[this.hands.length-1].cards[0].calculateNewTotal(this.hands[this.hands.length-1]);

    this.hands[this.hands.length - 2].calcHandTotal();
    this.hands[this.hands.length - 1].calcHandTotal();

    // this.handTotals.pop();
    this.handTotals.push(this.hands[length - 2].totals);
    this.handTotals.push(this.hands[length - 1].totals);
    // remember to set activeHand to new
  }

  // Doubles current bet but allows for only one more hit.

  doubleDown() {
    human.totalDDs++;
    Gui.toggledDDown();
    if (this.wallet >= this.currentBet * 2) {
      this.currentBet *= 2;
      return true;
    }
    return false;
  }

  // Resets values to original data

  clearGameSpecific() {
    this.hands = [];
    this.handsLeft = 0;
    this.doubled = false;
    this.cantHit = false;
    currentDeck = new Deck();
  }
}

// Every story needs a bad guy

class Jimbo extends Player {
  constructor(name) {
    super(name);
  }

  // Executes one complete Jimbo game after the player stops.

  jimboTurn() {
    this.hands[0].calcHandTotal(); // recalculates total with first card added back in
    Gui.renderOutput(
      `Jimbo starts with a ${this.hands[0].cards[0].convertFace()} of ${
        this.hands[0].cards[0].suit
      } and a
        ${this.hands[0].cards[1].convertFace()} of ${
        this.hands[0].cards[1].suit
      }. His starting total is ${this.hands[0].total}.`,
      SPACING
    );

    let jimboHit;
    while (this.hands[0].total < JIMBO_MAX) {
      jimboHit = this.hit(this.hands[0]);

      Gui.renderOutput(
        `Jimbo hits for ${jimboHit.convertFace()}! His total is now ${
          this.hands[0].total
        }`,
        SPACING
      );
    }
    if (this.hands[0].total > MAX_VALUE) {
      Gui.renderOutput(JIMBO_BUST);
    }

    currentGame.determineWinner(activeHand);
  }
}

// Holds information about an active game

//  NOTE TO SELF: should maybe store bets for each hand in Game, then can apply them
//  to losses after all splits are resolved.
//  Change winning message when hasSplit = true (or array.length > 1?) to be like
//  Here are the totals for your hand!
//      Hand 1: ${APPROPRIATE MESSAGE}
//      Hand 2: ${APPROPRIATE MESSAGE}
//      Hand 3: ${APPROPRIATE MESSAGE}
//  You have won/lost a total of ${totalWalletChange}
//  Then add that totalWalletChange to human.wallet.

class Game {
  constructor() {
    this.hasSplit = false;
    human.clearGameSpecific();

    jimbo = new Jimbo("Jimbo");
    jimbo.hands[0] = jimbo.newHand();
    human.hands[0] = human.newHand();
    activeHand = human.hands[0];
    gameOn = true;

    Gui.toggleAllGameButtons();
    // Gui.toggleNewGameButton();
    Gui.renderMoney();

    this.startingHand(); // doesn't show jimbo if player busts or blackjacks
    if (gameOn) {
      // to start
      this.displayJimbo();
    }
  }

  // Displays the starting hand text and checks for player BlackJack

  startingHand() {
    activeHand.calcHandTotal();
    Gui.renderOutput(
      `You start with a ${activeHand.cards[0].convertFace()} of ${
        activeHand.cards[0].suit
      } and a ${activeHand.cards[1].convertFace()} of ${
        activeHand.cards[1].suit
      }. Your starting total is ${activeHand.total}.
      
      `
    );

    // this.hasSplit = split();

    if (this.ifBlackJack(activeHand)) {
      const originalBet = +human.currentBet;
      human.currentBet = Math.floor(human.currentBet * 1.5);
      human.bjs++;
      Gui.renderOutput(BLACKJACK);
      human.handsLeft--;
      if (this.ifBlackJack(jimbo.hands[0])) {
        this.displayJimbo();
      }
      this.determineWinner(activeHand);
      human.currentBet = +originalBet; // resets bet after hand
    }
  }

  // Checks if given player busted

  ifBust(hand) {
    return hand.total > MAX_VALUE;
  }

  // Checks for blackjack

  ifBlackJack(hand) {
    return hand.total === MAX_VALUE && hand.cards.length === 2;
  }

  // Outputs Jimbo's current visible card

  displayJimbo() {
    if (this.ifBlackJack(jimbo.hands[0])) {
      Gui.renderOutput("Just a sec... looks like Jimbo has a...");
      Gui.renderOutput(BLACKJACK);
      human.jimboBJs++;
      human.handsLeft--;
      //   human.hands.pop();
      this.determineWinner(activeHand);
      return;
    }

    jimbo.hands[0].total = jimbo.hands[0].cards[1].scoredValue;

    Gui.renderOutput(
      `Jimbo is showing ${jimbo.hands[0].cards[1].convertFace()} of ${
        jimbo.hands[0].cards[1].suit
      }.`,
      SPACING
    );
  }

  resolveHands() {}

  // Checks results of game to determine winner

  //   NOTE TO SELF: need to figure out how to only do this at end, after all human hands have been
  //   played through (and not coming here for busts until very end) thencheck against the handTotals
  //   values on human, and potentially create a scores/bets array to store the winnings/losses for each

  determineWinner(hand) {
    if (
      (hand.total > jimbo.hands[0].total && !(hand.total > MAX_VALUE)) ||
      (jimbo.hands[0].total > MAX_VALUE && hand.total <= MAX_VALUE)
    ) {
      human.totalWinnings += human.currentBet;
      human.updateBets(true);
      human.wallet += human.currentBet;
      human.wins++;
      Gui.renderOutput(PLAYER_WINS);
      Gui.renderOutput(`You have won \$${human.currentBet}!`, SPACING);
      this.resetDoubleDown();
    } else if (hand.total === jimbo.hands[0].total) {
      human.ties++;
      Gui.renderOutput(PLAYER_DRAW, SPACING);
      this.resetDoubleDown();
    } else {
      human.losses++;
      human.totalWinnings -= human.currentBet;
      human.updateBets(false);
      human.wallet -= human.currentBet;
      Gui.renderOutput(PLAYER_LOSES);
      Gui.renderOutput(
        `Jimbo slurps up \$ ${human.currentBet} from your wallet!`,
        SPACING
      );
      this.resetDoubleDown();
    }
    // human.hands.pop();
    Gui.toggleAllGameButtons();
    if (human.handsLeft === 0) {
      human.games++;
      gameOn = false;
      Gui.renderStats();
      Gui.toggleAllGameButtons();
      Gui.toggleNewGameButton();
    }
  }

  resetDoubleDown() {
    if (human.doubled) {
      human.currentBet /= 2;
      Gui.renderBet();
    }
  }
}

// -------------------HANDLERS--------------------- \\

function betButtonHandler() {
  if (human && !gameOn) {
    let betValue = bjBetEntry.value.trim().replace("$", "").replace(",", ""); // scrubs input
    betValue = +betValue; // parses int

    // validates entered text was a number or gives appropriate insult
    Gui.clearOutput();
    Gui.renderBet();
    if (isNaN(betValue)) {
      Gui.renderOutput(BET_FAIL, SPACING);
    } else if (betValue <= human.wallet) {
      if (betValue >= MIN_BET || betValue === human.wallet) {
        human.currentBet = betValue;
        Gui.renderOutput(`${BET_SUCCESS}${human.currentBet}!`, SPACING);
      } else {
        Gui.renderOutput(JIMBO_INSULT_MIN_BET, SPACING);
      }
    } else {
      Gui.renderOutput(JIMBO_INSULT_ISF, SPACING);
      Gui.renderOutput(`Try something you can afford. Like ${human.wallet}!`);
    }
  }
}

function playButtonHandler() {
  currentDeck = new Deck();
  textGame.classList.remove("invisible");
  playAsker.classList.add("invisible");
  statsTable.classList.remove("invisible");
  Gui.clearOutput();
  Gui.renderOutput(GREETING, SPACING);
  Gui.renderStats();
}

function exitButtonHandler() {
  textGame.classList.add("invisible");
  playAsker.classList.remove("invisible");
  statsTable.classList.add("invisible");

  // Wipes current game data

  Gui.resetStats();
  human = undefined;
  jimbo = undefined;
  gameOn = false;
  Gui.clearOutput();
  Gui.renderMoney();
  Gui.toggleNewPlayerButton();
  Gui.toggleNewGameButton();
}

function newPlayerHandler() {
  if (!human) {
    Gui.clearOutput();
    human = new Player("Human");
    Gui.resetStats();
    // Gui.renderOutput(GREETING, SPACING);
    Gui.toggleNewPlayerButton();
    Gui.toggleNewGameButton();
    Gui.renderOutput(CHANGE_BET, SPACING);
  }
}

function newGameHandler() {
  if (!gameOn && human) {
    Gui.clearOutput();
    if (human.wallet === 0) {
      Gui.renderOutput(JIMBO_INSULT_BROKE, SPACING);
      human = undefined;
      Gui.toggleNewPlayerButton();
    } else if (human.wallet < human.currentBet) {
      Gui.renderOutput(JIMBO_INSULT_ISF, SPACING);
    } else {
      currentGame = new Game();
    }
  }
}

function hitButtonHandler() {
  if (gameOn && !human.cantHit) {
    const hitCard = human.hit(activeHand);
    activeHand.calcHandTotal();
    Gui.toggledDDown();
    Gui.renderOutput(
      `You hit for ${hitCard.convertFace()}! Your total is now ${
        activeHand.total
      }.`,
      SPACING
    );
    if (human.doubled) {
      this.cantHit = true;
    }
    if (currentGame.ifBust(activeHand)) {
      Gui.renderOutput(PLAYER_BUST);
      human.handsLeft--;
      human.totalBusts++;
      currentGame.determineWinner(activeHand);
    }
  }
  Gui.toggleHitButton();
}

function stayButtonHandler() {
  if (gameOn) {
    Gui.renderOutput(STAY_MESSAGE, SPACING);
    human.handsLeft--;
    if (human.handsLeft === 0) {
      jimbo.jimboTurn();
    }
  }
}

function splitButtonHandler() {
  if (activeHand.checkSplit()) {
    human.split();
  }
}

function ddownButtonHandler() {
  if (human.doubleDown() && !human.hasSplit) {
    Gui.renderOutput(
      `You have doubled down! 
        Your current bet is now \$ ${human.currentBet}.`,
      SPACING
    );

    human.doubled = true;
    hitButtonHandler();

    Gui.toggleHitButton();
  } else {
    Gui.renderOutput(JIMBO_INSULT_DDOWN, SPACING);
  }
}
