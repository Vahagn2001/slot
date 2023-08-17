// Configs
const getRandomCoefficients = () => {
    const coefficients = fruits.map(() => Math.round(Math.random() * 15) + 2);
    return coefficients;
};

const fruits = ["img/avocado.png", "img/cherry.png", "img/watermelon.png", "img/lemon.png"];
const fruitsCoefficents = getRandomCoefficients();

const RANDOM_FRUITS_COUNT = 10;

// Elements
const fruitsCoefficentsElement = document.querySelector(".intro__fruits-coefficents");
const gameElement = document.querySelector(".game__fruits");
const balance = document.querySelector(".game__balance");

const main = () => {
    printCoefficients();

    addIntroBtnFunctional();

    addGameSettingsFunctional();
};

const printCoefficients = () => {
    const str = fruits.reduce((acc, fruitImg, i) => `
        ${acc}
        <li>
            <img src="${fruitImg}">

            <span>${fruitsCoefficents[i]}x</span>
        </li>
    `, "");

    fruitsCoefficentsElement.innerHTML = str;
};

const addIntroBtnFunctional = () => {
    const introBtn = document.querySelector(".intro__play");

    introBtn.addEventListener("click", () => document.body.classList.add("show-settings"));
}

const addGameSettingsFunctional = () => {
    const form = document.querySelector(".game-settings__form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const rowCountValidation = validateField(form.elements["row-count"]);
        const depositAmountValidation = validateField(form.elements["deposit-amount"]);

        if (!rowCountValidation.isValid || !depositAmountValidation.isValid) return;

        generateFruits(+rowCountValidation.value);
        addBetFunctional(+rowCountValidation.value);

        balance.textContent = +depositAmountValidation.value;


        document.body.classList.remove("show-settings");
        document.body.classList.add("show-game");
    });
}

const validateField = field => {
    let isValid = true;

    const min = field.getAttribute("min");
    const max = field.getAttribute("max");
    const isWholeNumber = field.getAttribute("data-whole-number");

    if (min !== null && +field.value < +min) isValid = false;

    if (max !== null && +field.value > +max) isValid = false;

    if (isWholeNumber === "true" && field.value.includes(".")) isValid = false;

    if (isValid) field.classList.remove("invalid");
    else field.classList.add("invalid");

    return {
        isValid,
        value: field.value
    };
}

const generateRandomFruitsHTML = () => {
    let fruitsHTML = "";

    for (let i = 0; i < RANDOM_FRUITS_COUNT; i++) {
        const randomFruitIndex = Math.round(Math.random() * 3);

        fruitsHTML += `
            <li>
                <img src="${fruits[randomFruitIndex]}">
            </li>
        `;
    }

    return fruitsHTML;
}

const generateFruits = (rowsCount) => {
    gameElement.innerHTML = "";

    for (let i = 0; i < rowsCount; i++) {
        const row = document.createElement("div");

        row.classList.add("game__row");

        for (let i = 0; i < fruits.length; i++) {
            const fruitsHTML = generateRandomFruitsHTML();

            row.innerHTML += `
                <div class="game__column">
                    <ul class="game__column-container">
                        ${fruitsHTML}
                    </ul>
                </div>
            `;
        }

        gameElement.append(row);
    }
}

const addBetFunctional = (rowsCount) => {
    const form = document.querySelector(".game__bet");

    const betBtn = form.querySelector("button");

    let isDisabled = false;

    form.addEventListener("submit", e => {
        e.preventDefault();

        if (isDisabled) return;

        const betAmountValidation = validateField(form.elements["bet-amount"]);
        const betAmount = +betAmountValidation.value;

        if (!betAmountValidation.isValid || betAmount > +balance.textContent) return;

        gameElement.classList.remove("bet-animation");

        generateFruits(rowsCount);

        isDisabled = true;

        balance.textContent -= betAmount;

        setTimeout(() => {
            betBtn.setAttribute("disabled", "");

            gameElement.classList.add("bet-animation");

            gameElement.querySelector(".game__column-container").addEventListener("transitionend", () => {
                const rows = document.querySelectorAll(".game__row");

                let win = 0;

                rows.forEach((row) => {
                    const resultImg = Array.from(row.querySelectorAll("li:last-child img"));

                    const firstImgSrc = resultImg[0].getAttribute("src");

                    const isWin = resultImg.every((img) => {
                        const src = img.getAttribute("src");

                        return src === firstImgSrc;
                    });

                    if (!isWin) return;

                    const winFruitIndex = fruits.findIndex(f => f === firstImgSrc);

                    win += betAmount * fruitsCoefficents[winFruitIndex];

                    // for (let i = 0; i < fruits.length; i++) {
                    //     if (firstImgSrc === fruits[i]) win += betAmount * fruitsCoefficents[i];
                    // }
                });

                if (win) {
                    alert(`You win: ${win}`);
                    balance.textContent = +balance.textContent + win;
                }


                isDisabled = false;
                betBtn.removeAttribute("disabled");
            });
        });
    });
}

main();