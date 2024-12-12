var Store = /** @class */ (function () {
    function Store() {
        this.inputParams = {
            from: '',
            to: [],
            dir: '',
            skipExisting: false,
            genType: '',
            diff: ['', ''],
        };
    }
    Store.prototype.setInputParams = function (params) {
        this.inputParams = params;
    };
    Store.prototype.getInputParams = function () {
        return this.inputParams;
    };
    return Store;
}());
export var store = new Store();
