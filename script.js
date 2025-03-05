let informatic = document.getElementById("informatic")
let progress = document.getElementById("progress")
let typing_area = document.getElementById("typing_area")
let out_of_focus_warning = document.getElementById("out_of_focus_warning")
let enter_name_container = document.getElementById("enter_name_container")
let thank_you_page = document.getElementById("thank_you_page")
let think_typing_container = document.getElementById("think_typing_container")
let question = document.getElementById("question")
let thinking_typing_area = document.getElementById("thinking_typing_area")


const paragraph = "The sun dipped below the horizon, painting the sky in hues of orange and pink, as a gentle breeze rustled through the trees. Birds chirped their evening songs, signaling the close of another day. Children laughed and played in the distance, their joyful voices carrying through the air. A lone cyclist pedaled down the quiet street, the hum of tires on asphalt blending with the sounds of the settling world. The aroma of freshly baked bread wafted from a nearby home, inviting thoughts of warmth and comfort. In that moment, time seemed to slow, offering a brief respite from the rush of life."

// paragraph shall only be alphabetical and space in nature, no punctuations and no numbers

let current_length = 0;
let total_length = 0;

let data = []

typing_area.addEventListener("keydown", event => {
    const charCode = event.key.charCodeAt(0);
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
        data.push({
            event: "keydown",
            key: event.key,
            timestamp: performance.now()
        })
    }
})

typing_area.addEventListener("keyup", event => {
    const charCode = event.key.charCodeAt(0);
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
        data.push({
            event: "keyup",
            key: event.key,
            timestamp: performance.now()
        })
    }
})

function preprocess_paragraph_into_dom(paragraph, parent) {
    let words = paragraph.trim().toLowerCase().split(" ")

    for (let word of words) {
        let current_word_element = document.createElement("word")
        parent.appendChild(current_word_element)

        let letters = word.split("")
        for (let letter of letters) {
            const charCode = letter.charCodeAt(0);
            if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
                if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
                    total_length = total_length + 1;
                }
                let current_letter_element = document.createElement("letter")
                current_letter_element.textContent = letter
                current_word_element.appendChild(current_letter_element)
            }
        }
    }
}

preprocess_paragraph_into_dom(paragraph, typing_area)

progress.textContent = current_length + "/" + total_length
informatic.textContent = "No rush! This is not a speed test. Type naturally with minimal distractions. This will be used for research purposes. On completing last word, press [SPACE]"
document.getElementById("out_of_focus_warning").innerHTML =
    '<i class="fa-solid fa-triangle-exclamation"></i> click on paragraph to focus';

let current_word_element = typing_area.firstChild
let current_letter_element = current_word_element.firstChild
current_letter_element.classList.add("cursor")

typing_area.addEventListener("keydown", handle_keydown)

function handle_keydown(event) {
    event.key = event.key.toLowerCase()
    charCode = event.key.charCodeAt(0)
    if (event.key == " " || (event.key.length == 1 && charCode >= 97 && charCode <= 122)) {

        if (event.key != " ") {
            if (current_letter_element) {
                if (event.key == current_letter_element.textContent) {
                    current_length = current_length + 1
                    progress.textContent = current_length + "/" + total_length
                    current_letter_element.classList.add("correct")
                }
                else
                    current_letter_element.classList.add("incorrect")
                current_letter_element.classList.remove("cursor")
                current_letter_element = current_letter_element.nextSibling
                if (current_letter_element)
                    current_letter_element.classList.add("cursor")
            } else {
                extra_letter_element = document.createElement("letter")
                extra_letter_element.textContent = event.key
                extra_letter_element.classList.add("extra")
                current_word_element.appendChild(extra_letter_element)
                current_letter_element = extra_letter_element.nextSibling
                if (current_letter_element)
                    current_letter_element.classList.add("cursor")
            }
        } else {
            // key pressed is a space
            if (current_word_element.nextSibling) {
                if (current_letter_element)
                    current_letter_element.classList.remove("cursor")
                current_word_element = current_word_element.nextSibling
                current_word_element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                current_letter_element = current_word_element.firstChild
                current_letter_element.classList.add("cursor")
            } else {
                typing_area.removeEventListener("keydown", handle_keydown)
                event.preventDefault();
                handle_end_of_paragraph()
            }
        }
    }
}
typing_area.addEventListener("focus", function () {
    out_of_focus_warning.style.opacity = "0%"
})

typing_area.addEventListener("blur", function () {
    out_of_focus_warning.style.opacity = "100%"
})

let username = ""

function handle_name_submit() {
    let name_input = document.getElementById("name_input").value;
    let email_input = document.getElementById("email_input").value;
    let gender_input = document.getElementById("gender_input").value;
    let employed_input = document.getElementById("employed_input").value;
    let age_input = document.getElementById("age_input").value;
    let programmer_input = document.getElementById("programmer_input").value;


    if (!name_input || !email_input || !gender_input || !employed_input || !age_input || !programmer_input) {
        alert("Please fill in all fields before proceeding.");
        return;
    }
    document.getElementById("enter_name_container").style.display = "none";
    document.getElementById('question_container').style.display = 'block';
}

function handle_question_submit() {
    const answer = document.getElementById('answer_input').value;
    if (!answer) {
        alert("Please enter an answer.");
        return;
    }
    let ans = answerInput.value.trim();
    if (ans.length < 50) {
        alert("Your answer must be at least 50 characters long.");
        return;
    }
    document.getElementById('progress_typing_container').style.display = 'block';
    document.getElementById('question_container').style.display = 'none';

}

let results = [];
let thinkingData = []; // Array to store thinking phase keystrokes

let answerInput = document.getElementById("answer_input"); // Get the answer input field

// Listen for keydown event
answerInput.addEventListener("keydown", event => {
    const charCode = event.key.charCodeAt(0);
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
        thinkingData.push({
            event: "keydown",
            key: event.key,
            timestamp: performance.now()
        });
    }
});

// Listen for keyup event
answerInput.addEventListener("keyup", event => {
    const charCode = event.key.charCodeAt(0);
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
        thinkingData.push({
            event: "keyup",
            key: event.key,
            timestamp: performance.now()
        });
    }
});

function handle_end_of_paragraph() {
    thank_you_page.style.opacity = "100%";
    thank_you_page.style.pointerEvents = "auto";

    results = processEventsWithSlidingWindow(data, 100, 25);

    // Backend endpoint
    const endpoint = "https://flask-backend-biometrics.onrender.com/keystroke";

    const email = document.getElementById("email_input").value;
    const gender = document.getElementById("gender_input").value;
    const age = document.getElementById("age_input").value;
    const employed_input = document.getElementById("employed_input").value;
    const programmer_input = document.getElementById("programmer_input").value;
    const handedness = document.getElementById("handedness_input").value;

    // Prepare the data for keystrokes request
    const keystrokesPostData = {
        email_id: email,
        type: 1,
        instance: 3,
        keystrokes: data,
        age: age,
        sex: gender,
        employment_status: employed_input,
        programmer: programmer_input,
        handedness: handedness
    };

    // Prepare the data for thinkingKeystrokes request
    const thinkingPostData = {
        email_id: email,
        type: 2,
        instance: 3,
        keystrokes: thinkingData, // Separate request for thinking data
        age: age,
        sex: gender,
        employment_status: employed_input,
        programmer: programmer_input,
        handedness: handedness
    };
    // First request: Sending keystrokes data
    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(keystrokesPostData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Keystrokes Request failed! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {

            // Second request: Sending thinking keystrokes data after the first request succeeds
            return fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(thinkingPostData)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`ThinkingKeystrokes Request failed! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log("ThinkingKeystrokes Success:", responseData);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}



//we need to use pointer approach...
//if letter typed, move to the next letter if it exists
//if next letter does not exist, create it using createElement()
// if letter typed is correct- mark is as green
// if letter typed is incorrect- mark as red