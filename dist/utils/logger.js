import chalk from 'chalk';
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.error = function (message) {
        console.log("".concat(chalk.red(message)));
    };
    Logger.log = function (message) {
        console.log(message);
    };
    return Logger;
}());
export { Logger };
