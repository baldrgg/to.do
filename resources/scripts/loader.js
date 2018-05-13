'use strict';
let loader = document.querySelector('#loaded-progress-bar');

let resources = [], loaded = [];

let progress = 80;

// Load controller and add event listeners.
((w) => {
    w.controller = new Controller().load();

    document.querySelector('#add').addEventListener('click', (e) =>
    {
        let input = document.querySelector('#item');

        if (input.value !== '' || ACCEPT_EMPTY_STRINGS) {
            let task = new Task(input.value);
            controller.push(task);

            if (CLEAR_INPUT_AFTER_CREATING) {
                input.value = '';
            }
        }
    })

    let animationTimeout = setTimeout(() => {
        loader.style.width = '50%';
        clearTimeout(animationTimeout);
    }, 200);
})(window);

// Animate progress bar.
if (progress) {
    let animator = setInterval(() => {
        loader.style.width = Number(loader.style.width.split('%')[0]) + 1 + '%';

        if (Number(loader.style.width.split('%')[0]) >= progress) {
            // Resources load end.
            clearInterval(animator);
            // Show manager.
            document.body.removeChild(document.querySelector('#loader'));
            document.querySelector('#manager').style = '';
        }
    }, 30);
}
