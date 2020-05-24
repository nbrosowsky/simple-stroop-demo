// I use a custom timer called "eventTimer", but this code checks that it is loaded
// fallback to vanilla timers if eventTimer is not loaded...
// you could replace all eventTimer.setTimeout with window.setTimeout and everything would still work

if (typeof eventTimer == 'undefined') {
    //console.log("no eventTimer found... using JS setTimeout/Interval")
    var eventTimer = {};
    eventTimer.setTimeout = function (fun, time) {
        window.setTimeout(fun, time)
    }
    eventTimer.setInterval = function (fun, time) {
        window.setInterval(fun, time)
    }
}


/////// global variables ////////////
let allow_keys = false // when true keypresses trigger function
let trial_counter = 0  // tracks current trial


///// initialize the display for experiment ///////////
let init_stroop = function () {
    // add event listener for the on_keypress function
    document.addEventListener("keydown", on_keypress, false)

    // create content display within the main-display div
    document.querySelector("#main-display").style.display = "flex"
    document.querySelector("#main-display").innerHTML = `<div class="content-display flex flex-column justify-center lh-copy" style="text-align: left"></div>`

    // call instruction function
    instructions_pg1();
}


//////// INSTRUCTIONS /////////////////////
let instructions_pg1 = function () {
    document.querySelector(".content-display").style.visibility = "hidden"

    document.querySelector(".content-display").innerHTML =
        `<h3>Instructions</h3>
                <div>
                    <p>Your primary task will be to identify the color of the font as quickly and as accurately as possible.</p>
                    <p>On every trial you will see a color-word in a colored font (e.g., <span style="color: #e41a1c">BLUE</span>, <span style="color:#ffff33">YELLOW</span>, <span style="color:#1f78b4">BLUE</span>). </p>
                    <p>Your task is to indicate the color of the font (ignoring what the word says). You will use the keyboard to respond by pressing "b" for blue, "g" for green, "r" for red and "y" for yellow.</p>
                    <p>For example, if you were presented <span style="color: #1f78b4">RED</span>, you would respond by pressing "b" for blue.</p>
                    <p>If you were presented <span style="color: #4daf4a">GREEN</span>, you would respond by pressing "g" for green.</p>
                </div>
            <div class="flex flex-row" style="">
                <a id="dyn-bttn" class="bttn b-right f6 link dim ph3 pv2 mb2 dib white bg-gray" href="#0">NEXT</a>
            </div>`

    // can only set onclick after a button has been created
    document.querySelector("#dyn-bttn").setAttribute("onClick", "javascript: instructions_pg2();")
    document.querySelector(".content-display").style.visibility = "visible"

}

let instructions_pg2 = function () {
    document.querySelector(".content-display").style.visibility = "hidden"

    document.querySelector(".content-display").innerHTML =
        `<h3>Instructions</h3>
                <div>
                    <p>That's it!</p>
                    <p>When you are ready to begin, press start</p>
                </div>
            <div class="flex flex-row" style="">
                <a id="dyn-bttn" class="bttn b-right f6 link dim ph3 pv2 mb2 dib white bg-gray" href="#0">NEXT</a>
            </div>`

    // can only set onclick after a button has been created
    document.querySelector("#dyn-bttn").setAttribute("onClick", "javascript: start_task();")
    document.querySelector(".content-display").style.visibility = "visible"

}

////////////////////////////////////////////////

//////////////// stroop task functions /////////////////////
let start_task = function () {
    // setup the display for stroop task
    document.querySelector("#main-display").innerHTML = `
                  <div class="content-display flex items-center" >
                    <div class="stimulus-display">
                        <p id="stimulus" style="min-height: 82px;"></p>
                    </div>
                  </div>`

    fixate();

};

let pre_fixate = function () {
    // blank screen before fixation
    document.querySelector("#stimulus").innerHTML = ""

    timer = eventTimer.setTimeout(fixate, 500)

}

let fixate = function () {
    // display fixation
    document.querySelector("#stimulus").style.color = "grey"
    document.querySelector("#stimulus").innerHTML = "+"


    timer = eventTimer.setTimeout(post_fixate, 1000)
}

let post_fixate = function () {
    // blank screen after fixation
    document.querySelector("#stimulus").innerHTML = ""

    timer = eventTimer.setTimeout(stimulus, 500)
}

let stimulus = function () {
    // save time when the trial started
    trial_array[trial_counter].time_start = window.performance.now();

    let div = document.querySelector("#stimulus")
    div.style.visibility = "hidden"

    // change color to trial color
    div.style.color = trial_array[trial_counter].color

    // insert trial stimulus word into div
    div.innerHTML = trial_array[trial_counter].word.toUpperCase();

    div.style.visibility = "visible"

    // allow keyboard responses & wait for response
    allow_keys = true;

}


let end_trial = function () {
    // increase trial counter
    trial_counter++

    // if there are no more trials end experiment
    if (trial_counter > trial_array.length - 1) {
        end_exp();
        return
    }

    // else cue next trial
    pre_fixate();

}


let end_exp = function (){
    // typically you would submit the data through php which would automatically trigger the feedback html
    //submit_data();
    
    // but since the php won't post properly without a server I'll just trigger the html
     window.open("feedback-letter.html", "_self");
}
///////////////////////////////////////////////////////////////////////////////////////////


/////////// on keypress event // added as event listener on init /////////////////////////
let on_keypress = function (event) {
    let code = event.which || event.keyCode || 0
    let key = event.key

    key_time = window.performance.now();


    // do nothing if allow_keys is false
    if (allow_keys == false) {
        return;
    }

    // submit a response if current key one of the response keys
    if (code == 82 | code == 66 | code == 71 | code == 89) {
        // don't allow anymore keypresses
        allow_keys = false;

        // record response data
        trial_array[trial_counter].response = key;
        trial_array[trial_counter].reaction_time = key_time - trial_array[trial_counter].time_start
        trial_array[trial_counter].time_end = key_time


        end_trial();


    }

};
////////////////////////////////////////////////////////////////////////////////////////////
