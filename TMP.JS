let informatic = document.getElementById("informatic") 
let progress = document.getElementById("progress")
let typing_area = document.getElementById("typing_area")
let out_of_focus_warning = document.getElementById("out_of_focus_warning")

const paragraph = "  The sun dipped below the horizon, painting the sky in hues of orange and pink, as a gentle breeze rustled through the trees. Birds chirped their evening songs, signaling the close of another day. Children laughed and played in the distance, their joyful voices carrying through the air. A lone cyclist pedaled down the quiet street, the hum of tires on asphalt blending with the sounds of the settling world. The aroma of freshly baked bread wafted from a nearby home, inviting thoughts of warmth and comfort. In that moment, time seemed to slow, offering a brief respite from the rush of life."

let total_length = paragraph.replace(" ","").length
let current_length = 0;
progress.textContent = current_length+"/"+total_length

informatic.textContent = "No rush! This is not a speed test. Type naturally with minimal distractions. This will be used for research purposes."

typing_area.focus()

document.getElementById("out_of_focus_warning").innerHTML = 
    '<i class="fa-solid fa-triangle-exclamation"></i> click on paragraph to focus';

function preprocess_paragraph_into_dom(paragraph, parent){
    let words = paragraph.trim().toLowerCase().split(" ")

    for(let word of words){
        let current_word_element = document.createElement("word")
        parent.appendChild(current_word_element)

        let letters = word.split("")
        for(let letter of letters){
            let current_letter_element = document.createElement("letter")
            current_letter_element.textContent = letter
            current_word_element.appendChild(current_letter_element)
        }
    }
}

preprocess_paragraph_into_dom(paragraph,typing_area)

let current_word_element = typing_area.firstChild
let current_letter_element = current_word_element.firstChild
current_letter_element.classList.add("cursor")

typing_area.addEventListener("keydown", handle_keydown)

function handle_keydown(event){
    event.key = event.key.toLowerCase()

    if(event.key != " " && event.key != 'Backspace'){
        if(current_letter_element){
            if(event.key == current_letter_element.textContent){
                current_length = current_length + 1
                progress.textContent = current_length+"/"+total_length
                current_letter_element.classList.add("correct")
            }
            else
                current_letter_element.classList.add("incorrect")
            current_letter_element.classList.remove("cursor")
            current_letter_element = current_letter_element.nextSibling
            if(current_letter_element)
                current_letter_element.classList.add("cursor")
        }else{
            console.log("next sibling doesnt exist")
            extra_letter_element = document.createElement("letter")
            extra_letter_element.textContent = event.key
            extra_letter_element.classList.add("extra")
            current_word_element.appendChild(extra_letter_element)
            current_letter_element = extra_letter_element.nextSibling
            if(current_letter_element)   
                current_letter_element.classList.add("cursor")
        }
    }
    else if(event.key == 'Backspace'){
        // do nothing
    }else{
        // key pressed is a space
        if(current_word_element.nextSibling){
            if(current_letter_element)
                current_letter_element.classList.remove("cursor")
            current_word_element = current_word_element.nextSibling
            current_word_element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            current_letter_element = current_word_element.firstChild
            current_letter_element.classList.add("cursor")
        }else{
            console.log("reached end of paragraph")
            typing_area.removeEventListener("keydown", handle_keydown)
        }
    }
}
typing_area.addEventListener("focus", function(){
    out_of_focus_warning.style.opacity = "0%"
})

typing_area.addEventListener("blur", function(){
    out_of_focus_warning.style.opacity = "100%"
})

//we need to use pointer approach... 
//if letter typed, move to the next letter if it exists
//if next letter does not exist, create it using createElement()
// if letter typed is correct- mark is as green
// if letter typed is incorrect- mark as red