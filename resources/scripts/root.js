'use strict';
class Task {
    constructor(value) {
        this.value = value;
        this.description = '';
        this.date = '';
        this.status = false;
        this.id = undefined;
        this._navigate = '<Node>';
        this._createdAt = (Date.now)();
    }
}

class Controller {
    constructor() {
        this.container = [];
        this.Renderer = new Renderer();
    }
    /**
        Get task by id.

        @param {Number|String} id - Task id.
    */
    get(id) {
        let task;

        this.container.forEach((i, item, array) => {
            if (array[item].id === Number(id)) {
                task = array[item];
            }
        })

        return task;
    }
    /**
        Change status of task.

        @param {Task} task - Task to change status of it.
    */
    changeState(task) {
        task.status = !task.status;
        this.Renderer.changeState(task);
        this.save();
    }
    /**
        Push new tasks to container.

        @param {Task} - Task to push.
    */
    push() {
        for (let task in arguments) {
            if (arguments[task] instanceof Task ||
                arguments[task]._navigate === '<Node>')
            {
                // Create an uID for each task.
                arguments[task].id = this.container.length;
                // Push task to container.
                this.container.push(arguments[task]);
                // Append changes.
                this.save();
                this.Renderer.addToDOM(arguments[task]);
            }
        }
    }
    /*
        Remove task from manager.
    */
    remove(task) {
        // Remove task from DOM.
        this.Renderer.removeFromDOM(task);
        // Remove task from container and append changes.
        let index = this.container.indexOf(task);
        this.container.splice(index, 1);

        this.save();
    }
    /**
        Load last saved container.
    */
    load() {
        if (window.localStorage.getItem('controller') !== null) {
            let loader = JSON.parse(decodeURIComponent(escape(atob( window.localStorage.getItem('controller') ))));
            // Load tasks.
            loader.container.forEach((i, item, array) => this.push(array[item]));
        }
        // Load renderer.
        this.Renderer.append(this);

        return this;
    }
    /**
        Save current state of container.
    */
    save() {
        //
        this.Renderer.controller = undefined;
        //
        let base64 = btoa(unescape(encodeURIComponent( JSON.stringify(this) )));
        window.localStorage.setItem('controller', base64);
        //
        this.Renderer.controller = this;
    }
}

class Renderer {
    constructor() {
        this.controller = undefined;
        this.container = document.querySelector('#container');
        this.completed = document.querySelector('#completed');
        this.lastCreatedNode = this.completed;
        this.lastCreateCompletedNode = null;
    }
    /**
        Init controller.

        @param {Controller} controller - Current controller state.
    */
    append(controller) {
        this.controller = controller;
    }
    /**
        Render task to DOM.

        @param {Task|Array} task - Task or array of tasks to render.
    */
    addToDOM(task) {
        if (task instanceof Array) {
            task.forEach((i, item, array) => {
                if (array[item] instanceof Task) {
                    this.addToDOM(array[item]);
                }
            })
        }

        if (task.value > MAX_TASK_LENGTH) return;

        let node = document.createElement('div');
        node.className = 'task';
        node.dataset.id = task.id;

        if (task.status) {
            node.id = 'completed';
        }

        let content = document.createElement('div');
        content.className = 'content';

        let value = document.createElement('a');

        if (task.value.length <= MAX_TAB_LENGTH) {
            value.innerHTML = task.value;
        } else {
            value.innerHTML = Tools.joinDoubleSide(Tools.divideString(task.value, MAX_TAB_LENGTH), '<a>', '</a><br>');
        }

        let buttons = document.createElement('div');
        buttons.className = 'buttons';

        // Create buttons.
        let remove = document.createElement('img');
        remove.className = 'remove';
        let complete = document.createElement('img');
        complete.className = 'complete';

        [remove, complete].forEach((i, item, array) => buttons.appendChild(array[item]));
        [value, buttons].forEach((i, item, array) => content.appendChild(array[item]));

        let that = this;

        remove.addEventListener('touchstart', function(e) {
            let index = this.parentNode.parentNode.parentNode.dataset.id;
            that.controller.remove(that.controller.get(index));
        })

        complete.addEventListener('touchstart', function(e) {
            let index = this.parentNode.parentNode.parentNode.dataset.id;
            that.controller.changeState(that.controller.get(index));
        })


        node.appendChild(content);

        /**
            @example Very long text values in DOM will looks something like this:
            '       SOME_TEXT_STRING'
            '   DOUBLE_TEXT_STRING'
            '   ....'
            WHERE '   ' is normal indent, and '      ' isnt.
            Next code will remove double TAB from text to get smth like this:
            '   SOME_TEXT_STRING'
            '   DOUBLE_TEXT_STRING'
            '   ....'
        */
        content.childNodes[0].childNodes[0].style = 'margin-left: 0px;';

        if (task.status) {
            this.completed.appendChild(node);
        } else {
            if (NEWER_ON_TOP) {
                try {
                    this.container.insertBefore(node, this.lastCreatedNode);
                } catch(e) {
                    this.container.insertBefore(node, this.completed);
                }
                this.lastCreatedNode = node;
            } else {
                this.container.insertBefore(node, this.completed);
            }
        }
    }
    /**
        Remove task from DOM.

        @param {Task} task - Task to remove.
    */
    removeFromDOM(task) {
        [this.container, this.completed].forEach((i, item, array) => {
            array[item].childNodes.forEach((number, child, parent) => {
                if ('dataset' in parent[child] &&
                    'id' in parent[child].dataset)
                {
                    if (Number(parent[child].dataset.id) === task.id) {
                        array[item].removeChild(parent[child]);
                    }
                }
            })
        })
    }
    /**
        Render task with new status state.
    */
    changeState(task) {
        /* Animate. */

        /* Remove and fast render. */
        this.removeFromDOM(task);
        this.addToDOM(task);
    }
}
