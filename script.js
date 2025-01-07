let typing_area = document.getElementById("typing_area")
let progress = document.getElementById("progress")
let out_of_focus_warning = document.getElementById("out_of_focus_warning")
let informatic = document.getElementById("informatic") 


const paragraph = "  The sun dipped below the horizon, painting the sky in hues of orange and pink, as a gentle breeze rustled through the trees. Birds chirped their evening songs, signaling the close of another day. Children laughed and played in the distance, their joyful voices carrying through the air. A lone cyclist pedaled down the quiet street, the hum of tires on asphalt blending with the sounds of the settling world. The aroma of freshly baked bread wafted from a nearby home, inviting thoughts of warmth and comfort. In that moment, time seemed to slow, offering a brief respite from the rush of life."

let total_length = paragraph.replace(" ","").length
let current_length = 0;
progress.textContent = current_length+"/"+total_length

document.getElementById("out_of_focus_warning").innerHTML = 
    '<i class="fa-solid fa-triangle-exclamation"></i> click on paragraph to focus';

typing_area.focus()

informatic.textContent = "No rush ! This is not a speed test. Type naturally. This is for research purposes :) "

function preprocess_paragraph_into_dom(paragraph, parent){
    let words = paragraph.trim().toLowerCase().split(" ")

    for(let word of words){
        let current_word_element = document.createElement("word")
        current_word_element.style.display = "inline-block";
        current_word_element.style.marginRight = "1rem";
        current_word_element.style.marginBottom = "1rem";
        parent.appendChild(current_word_element)
        let letters = word.split("")
        
        for(let letter of letters){
            let current_letter_element = document.createElement("letter")
            current_letter_element.style.display = "inline-block";
            current_letter_element.textContent = letter
            current_word_element.appendChild(current_letter_element)
        }
    }
}

preprocess_paragraph_into_dom(paragraph,typing_area)

let current_word_element = typing_area.firstChild
let current_letter_element = current_word_element.firstChild
current_letter_element.style.textDecoration = "underline"

typing_area.addEventListener("keydown", handle_keydown)

function handle_keydown(event){
    event.key = event.key.toLowerCase()
    // we will have to limit the number of valid keys
    if(event.key != " " && event.key != 'Backspace'){
        // console.log(event.key)
        if(current_letter_element != null){
            console.log("current letter exists")
            if(event.key == current_letter_element.textContent){
                current_length = current_length + 1
                progress.textContent = current_length+"/"+total_length
                current_letter_element.classList.add("correct")
            }
            else
                current_letter_element.classList.add("incorrect")
            current_letter_element.style.textDecoration = "none"
            current_letter_element = current_letter_element.nextSibling
            if(current_letter_element)
                current_letter_element.style.textDecoration = "underline"
        }else{
            console.log("next sibling doesnt exist")
            extra_letter_element = document.createElement("letter")
            extra_letter_element.textContent = event.key
            extra_letter_element.className = "extra"
            current_word_element.appendChild(extra_letter_element)
            current_letter_element = extra_letter_element.nextSibling
            if(current_letter_element)   
                current_letter_element.style.textDecoration = "underline"
        }
    }
    else if(event.key == 'Backspace'){
    }else{
        console.log("space/backspace pressed")
        if(current_word_element.nextSibling){
            if(current_letter_element)
                current_letter_element.style.textDecoration = "none"
            current_word_element = current_word_element.nextSibling
            current_word_element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            current_letter_element = current_word_element.firstChild
            current_letter_element.style.textDecoration = "underline"
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