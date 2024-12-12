var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Command } from 'commander';
import path from 'path';
import { createDeclarationFile, parseJsonFile, showLangDiff, translateFile, } from './utils/index.js';
import { validateUserInput } from './utils/validation.js';
import { store } from './utils/store.js';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var pjson, appVersion, program, _a, from, to, genType, diff;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, parseJsonFile(path.join(process.cwd(), 'package.json'))];
                case 1:
                    pjson = _b.sent();
                    appVersion = pjson.version;
                    program = new Command();
                    program
                        .name('auto-lang')
                        .description('Generate translation files for multiple languages (i18n)')
                        .version(appVersion)
                        .option('-f, --from <lang>', 'language to translate from')
                        .option('-t, --to <lang...>', 'languages to translate to (seperated by space)')
                        .option('-d, --dir <directory>', 'directory containing the language files', 'translations')
                        .option('-s, --skip-existing', 'skip existing keys during translation')
                        .option('-g, --gen-type <lang>', 'generate types from language file')
                        .option('-d, --diff <lang...>', 'show missing keys between two language files')
                        .parse();
                    validateUserInput(program.opts());
                    store.setInputParams(program.opts());
                    _a = store.getInputParams(), from = _a.from, to = _a.to, genType = _a.genType, diff = _a.diff;
                    if (!(from && to)) return [3 /*break*/, 3];
                    return [4 /*yield*/, translateFile()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    if (!genType) return [3 /*break*/, 5];
                    return [4 /*yield*/, createDeclarationFile()];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    if (!diff) return [3 /*break*/, 7];
                    return [4 /*yield*/, showLangDiff()];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
main();
