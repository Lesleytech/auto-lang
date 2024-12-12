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
import path from 'path';
import { existsSync, promises as fs } from 'fs';
import { createSpinner } from 'nanospinner';
import JsonToTS from 'json-to-ts';
import prettier from 'prettier';
import { Logger } from './logger.js';
// @ts-expect-error
import translate from 'translate';
import { store } from './store.js';
function makeTranslatedCopy(source, target, targetLang) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, from, skipExisting, _i, _b, _c, key, value, _d, _e, err_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = store.getInputParams(), from = _a.from, skipExisting = _a.skipExisting;
                    _i = 0, _b = Object.entries(source);
                    _f.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    _c = _b[_i], key = _c[0], value = _c[1];
                    if (!(typeof value === 'object')) return [3 /*break*/, 3];
                    target[key] = target[key] || {};
                    return [4 /*yield*/, makeTranslatedCopy(value, target[key], targetLang)];
                case 2:
                    _f.sent();
                    return [3 /*break*/, 7];
                case 3:
                    _f.trys.push([3, 6, , 7]);
                    if (!!(target[key] && skipExisting)) return [3 /*break*/, 5];
                    _d = target;
                    _e = key;
                    return [4 /*yield*/, translate(value, {
                            from: from,
                            to: targetLang,
                        })];
                case 4:
                    _d[_e] = _f.sent();
                    _f.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _f.sent();
                    console.log('\n');
                    Logger.error(err_1.message);
                    process.exit(1);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var getTranslationObject = function (lang) {
    var dir = store.getInputParams().dir;
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var translatedObj, inputLangObj, outputFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    translatedObj = {};
                    return [4 /*yield*/, getInputLangObject()];
                case 1:
                    inputLangObj = _a.sent();
                    outputFile = path.join(process.cwd(), dir, "".concat(lang, ".json"));
                    if (!existsSync(outputFile)) return [3 /*break*/, 3];
                    return [4 /*yield*/, parseJsonFile(outputFile)];
                case 2:
                    translatedObj = _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, makeTranslatedCopy(inputLangObj, translatedObj, lang)];
                case 4:
                    _a.sent();
                    resolve(translatedObj);
                    return [2 /*return*/];
            }
        });
    }); });
};
export function createDeclarationFile() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, dir, genType, spinner, langObject, interfaces, typesDir, declarationFile, result, formattedContent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = store.getInputParams(), dir = _a.dir, genType = _a.genType;
                    spinner = createSpinner('Creating language type file').start();
                    langObject = parseJsonFile(path.join(process.cwd(), dir, "".concat(genType, ".json")));
                    interfaces = JsonToTS(langObject, {
                        rootName: 'GlobalTranslationType',
                    });
                    typesDir = path.join(process.cwd(), dir, 'types');
                    if (!!existsSync(typesDir)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs.mkdir(typesDir)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    declarationFile = path.join(typesDir, 'index');
                    result = "\n    type NestedKeyOf<ObjectType extends object> = {\n    [Key in keyof ObjectType & string]: ObjectType[Key] extends object\n      ? // @ts-ignore\n        `${Key}.${NestedKeyOf<ObjectType[Key]>}`\n      : `${Key}`\n    }[keyof ObjectType & string]\n\n    export type GlobalTranslation = NestedKeyOf<GlobalTranslationType>;\n\n    ".concat(interfaces.join('\n\n'), "\n  ");
                    return [4 /*yield*/, prettier.format(result, {
                            parser: 'typescript',
                        })];
                case 3:
                    formattedContent = _b.sent();
                    return [4 /*yield*/, fs.writeFile(declarationFile, formattedContent)];
                case 4:
                    _b.sent();
                    spinner.success({ text: 'Language type file created' });
                    return [2 /*return*/];
            }
        });
    });
}
export function translateFile() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, to, dir, spinner, langFile, translationObject, _i, to_1, lang;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = store.getInputParams(), to = _a.to, dir = _a.dir;
                    _i = 0, to_1 = to;
                    _b.label = 1;
                case 1:
                    if (!(_i < to_1.length)) return [3 /*break*/, 5];
                    lang = to_1[_i];
                    langFile = path.join(process.cwd(), dir, "".concat(lang, ".json"));
                    spinner = createSpinner("Translating to ".concat(lang, "...")).start();
                    return [4 /*yield*/, getTranslationObject(lang)];
                case 2:
                    translationObject = _b.sent();
                    return [4 /*yield*/, fs.writeFile(langFile, JSON.stringify(translationObject, null, 2))];
                case 3:
                    _b.sent();
                    spinner.success({ text: "Complete" });
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
export function parseJsonFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs.readFile(filePath, { encoding: 'utf-8' })];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
function getInputLangObject() {
    var _a = store.getInputParams(), dir = _a.dir, from = _a.from;
    var inputFile = path.join(process.cwd(), dir, "".concat(from, ".json"));
    return parseJsonFile(inputFile);
}
function getMissingKeys(source, target) {
    var missingKeys = [];
    function loop(source, target, path) {
        if (path === void 0) { path = ''; }
        for (var _i = 0, _a = Object.entries(source); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var currentPath = path ? "".concat(path, ".").concat(key) : key;
            if (typeof value === 'object') {
                if (target[key]) {
                    loop(value, target[key], currentPath);
                }
                else {
                    missingKeys.push(currentPath);
                }
            }
            else {
                if (!target[key]) {
                    missingKeys.push(currentPath);
                }
            }
        }
    }
    loop(source, target);
    return missingKeys;
}
export function showLangDiff() {
    return __awaiter(this, void 0, void 0, function () {
        var spinner, _a, dir, diff, lang1, lang2, lang1Object, lang2Object, missingKeys;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    spinner = createSpinner('Comparing language files').start();
                    _a = store.getInputParams(), dir = _a.dir, diff = _a.diff;
                    lang1 = diff[0];
                    lang2 = diff[1];
                    return [4 /*yield*/, parseJsonFile(path.join(process.cwd(), dir, "".concat(lang1, ".json")))];
                case 1:
                    lang1Object = _b.sent();
                    return [4 /*yield*/, parseJsonFile(path.join(process.cwd(), dir, "".concat(lang2, ".json")))];
                case 2:
                    lang2Object = _b.sent();
                    missingKeys = getMissingKeys(lang1Object, lang2Object);
                    Logger.log("\nMissing keys in ".concat(lang2, ".json compared to ").concat(lang1, ".json\n"));
                    Logger.log(missingKeys.join('\n') || 'No missing keys');
                    spinner.success({ text: 'Comparison complete' });
                    return [2 /*return*/];
            }
        });
    });
}
