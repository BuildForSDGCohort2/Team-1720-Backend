'use strict';

module.exports = {
    isValueEmpty(passedVal) {

        if (passedVal !== undefined && passedVal.length > 0) {
            return passedVal;
        }

        return false;
    }
}