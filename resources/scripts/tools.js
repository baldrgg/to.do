'use strict';
let Tools = {
    /**
        @example Tools.divideString('abcdefghijklmno', 3) => ['abc', 'def', 'ghi', 'jkl', 'mno'];
    */
    divideString: (string, symbolsCount) => {
        let array = [];

        for (let i = 0; i < string.length; i++) {
            if (i%symbolsCount) {
                array[array.length - 1] = array[array.length - 1] + string[i];
            } else {
                array[array.length] = string[i];
            }
        }

        return array;
    },
    /**
        @example Tools.joinDoubleSide(['abc', 'def', 'ghi'], '<', '>') => '<abc><def><ghi>';
    */
    joinDoubleSide: (array, left, right, params) => {
        let string = left + array[0] + right;

        for (var i = 1; i < array.length; i++) {
            string = string + left + array[i] + right;
        }

        return string;
    }
}
