let informatic = document.getElementById("informatic")
let progress = document.getElementById("progress")
let typing_area = document.getElementById("typing_area")
let out_of_focus_warning = document.getElementById("out_of_focus_warning")
let enter_name_container = document.getElementById("enter_name_container")
let name_input = document.getElementById("name_input")
let thank_you_page = document.getElementById("thank_you_page")

const paragraph = "  The sun dipped below the horizon"
// , painting the sky in hues of orange and pink, as a gentle breeze rustled through the trees. Birds chirped their evening songs, signaling the close of another day. Children laughed and played in the distance, their joyful voices carrying through the air. A lone cyclist pedaled down the quiet street, the hum of tires on asphalt blending with the sounds of the settling world. The aroma of freshly baked bread wafted from a nearby home, inviting thoughts of warmth and comfort. In that moment, time seemed to slow, offering a brief respite from the rush of life."

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
    // console.log(event.key, performance.now(), "start")
    event.key = event.key.toLowerCase()
    charCode = event.key.charCodeAt(0)
    if (event.key == " " || (event.key.length == 1 && charCode >= 97 && charCode <= 122)) {
        // console.log(event.key)
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
                // console.log("next sibling doesnt exist")
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
                // console.log("reached end of paragraph")
                typing_area.removeEventListener("keydown", handle_keydown)
                handle_end_of_paragraph()
            }
        }
    }
    // console.log(event.key, performance.now(), "end")
}
typing_area.addEventListener("focus", function () {
    out_of_focus_warning.style.opacity = "0%"
})

typing_area.addEventListener("blur", function () {
    out_of_focus_warning.style.opacity = "100%"
})

let username = ""

function handle_name_submit() {
    username = name_input.value
    if (username.length > 0) {
        enter_name_container.style.opacity = "0%"
        enter_name_container.style.pointerEvents = "none"
        // typing_area.focus()
    }
    else {
        window.alert("Name cannot be empty")
    }
}

let results = [];
function handle_end_of_paragraph() {
    console.log("reached end of paragraph")
    thank_you_page.style.opacity = "100%"
    thank_you_page.style.pointerEvents = "auto"
    console.log(data); //raw unprocessed data
    results = processEventsWithSlidingWindow(data, 100, 25);//define window size and overlap here
    console.log(results); //results is an array of objects
}

function sendResultsToServer(results) {
    fetch("http://localhost:5000/save-results", { //temporary server
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: results }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Results saved:", data);
        })
        .catch(error => {
            console.error("Error sending results:", error);
        });
}











//we need to use pointer approach... 
//if letter typed, move to the next letter if it exists
//if next letter does not exist, create it using createElement()
// if letter typed is correct- mark is as green
// if letter typed is incorrect- mark as red