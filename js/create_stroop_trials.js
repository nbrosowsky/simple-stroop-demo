// creates an array of stroop trials
let trial_array = function () {

    /* generic function to shuffle an array */
    function shuffle(array) {
        var tmp, current, top = array.length;
        if (top)
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }

        return array;
    }

    /* generic function to repeat an array */
    const makeRepeated = (arr, repeats) => [].concat(...Array.from({
        length: repeats
    }, () => arr));



    ////////////////////////////////////////////////////////////


    let N_trials = 48
    let temp_array = []


    // stimulus set 
    // each color name with hex code
    let stim_set = [["#e41a1c", "red", ], ["#1f78b4", "blue"], ["#4daf4a", "green"], ["#ffff33", "yellow"]]

    let con_stims = []
    let inc_stims = []

    for (i = 0; i < stim_set.length; i++) {
        for (ii = 0; ii < stim_set.length; ii++) {
            if (stim_set[i] == stim_set[ii]) {
                con_stims.push([stim_set[i], stim_set[ii]])
            }

            if (stim_set[i] != stim_set[ii]) {
                inc_stims.push([stim_set[i], stim_set[ii]])
            }


        }

    }

    // make equal con/inc trials
    con_stims = makeRepeated(con_stims, 3)

    // make enough for N_trials
    con_stims = makeRepeated(con_stims, (N_trials / 2) / con_stims.length)
    inc_stims = makeRepeated(inc_stims, (N_trials / 2) / inc_stims.length)

    // add them all together and randomize order
    all_trials = shuffle(con_stims.concat(inc_stims))

    
    for (n = 0; n < N_trials; n++) {
        // take one from array
        let current_stim = all_trials.pop()

        temp_array.push({
            subject: sub_code,
            trial: n + 1,
            word: current_stim[0][1],
            color: current_stim[1][0],
            congruency: (current_stim[0][1] == current_stim[1][1] ? "con" : "inc"),
            answer: current_stim[1][1][0]
        })

    }

    console.log(temp_array)


    return temp_array
}()
