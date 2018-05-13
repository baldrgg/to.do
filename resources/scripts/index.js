'use strict';
let controller = new Controller().load();

document.querySelector('#add').addEventListener('touchend', (e) =>
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
