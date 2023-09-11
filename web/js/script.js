var maxTries = 3;
var currentTries = 0;
var streak = 0;
var streakReedemable = true;

function generateText() {
    currentTries = 0;
    streakReedemable = true;
    updateUI();
    eel.generate_text()(setText);
}

function setText(text) {
    document.getElementById("text-display").innerHTML = text;
    document.getElementById("answer-inputs").innerHTML = '';
    const answerInputs = document.querySelectorAll(".author-answer");
    Array.from(answerInputs).forEach(input => {
        input.value = ''; input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                checkAnswers();
            }
        });
    });
}

function checkAnswers() {
    if (currentTries < maxTries) {
        const answerInputs = document.querySelectorAll(".author-answer");
        const yellowLabels = document.querySelectorAll(".author-yellowLabel");
        const redLabels = document.querySelectorAll(".author-redLabel");
        const userAnswers = Array.from(answerInputs).map(input => input.value);

        eel.get_correct_answers()(function (correctAnswers) {
            // Compare userAnswers with correctAnswers
            const allCorrect = userAnswers.every((userAnswer, index) => userAnswer === correctAnswers[index]);
            if (allCorrect && streakReedemable) {
                streak++;
                streakReedemable = false;
                updateUI();
            }
            var gotOneRight = false;
            for (let i = 0; i < answerInputs.length; i++) {
                // Disable input fields and remove input field background for correct answers only
                if (userAnswers[i] === correctAnswers[i]) {
                    if (!answerInputs[i].disabled) {
                        gotOneRight = true;
                    }
                    answerInputs[i].disabled = true;
                    answerInputs[i].style.color = 'inherit';
                    answerInputs[i].style.border = 'none';
                    answerInputs[i].style.backgroundColor = 'transparent';
                    answerInputs[i].style.fontWeight = 'bold';
                }
                else if (Array.from(correctAnswers).includes(userAnswers[i])) {
                    if (!yellowLabels[i].innerHTML.includes(userAnswers[i])) {
                        if (yellowLabels[i].innerHTML != "") {
                            yellowLabels[i].innerHTML += ", "
                        }
                        yellowLabels[i].innerHTML += userAnswers[i]
                    }
                } else {
                    if (!redLabels[i].innerHTML.includes(userAnswers[i])) {
                        if (redLabels[i].innerHTML != "") {
                            redLabels[i].innerHTML += ", "
                        }
                        redLabels[i].innerHTML += userAnswers[i]
                    }
                }
            }
            if (!gotOneRight && !allCorrect) {
                currentTries++;
                updateUI();
                if (currentTries >= maxTries) {
                    streak = 0;
                    updateUI();
                    for (let i = 0; i < answerInputs.length; i++) {
                        // Disable All input fields and make the wrong ones red
                        if (!(userAnswers[i] === correctAnswers[i])) {
                            answerInputs[i].disabled = true;
                            answerInputs[i].value = correctAnswers[i];
                            answerInputs[i].style.color = 'red';
                            answerInputs[i].style.border = 'none';
                            answerInputs[i].style.backgroundColor = 'transparent';
                            answerInputs[i].style.fontWeight = 'bold';
                        }
                    }
                }
            }
        });
    }
}

function updateUI() {
    document.getElementById("streak-display").innerHTML = "You are on a streak of " + streak + "!";
    document.getElementById("tries-display").innerHTML = (maxTries - currentTries) + " Tries Remaining";
    if (maxTries - currentTries == 1) {
        document.getElementById("tries-display").innerHTML = "1 Try Remaining";
    }
    if (maxTries - currentTries == 0) {
        document.getElementById("tries-display").style.color = 'red'
    } else {
        document.getElementById("tries-display").style.color = 'green'
    }
}