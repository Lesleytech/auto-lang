import { existsSync } from 'fs';
import path from 'path';
import { Logger } from './logger.js';
export function validateUserInput(params) {
    if (!Object.keys(params).length) {
        Logger.error("Invalid arguments. Use \"--help\" for usage");
        process.exit(1);
    }
    var to = params.to, from = params.from, dir = params.dir, genType = params.genType, diff = params.diff;
    if ((from && !to) || (to && !from)) {
        Logger.error("\"--from\" and \"--to\" are dependent options");
        process.exit(1);
    }
    var inputFilePath = path.join(process.cwd(), dir, "".concat(from, ".json"));
    var genTypeFilePath = path.join(process.cwd(), dir, "".concat(genType, ".json"));
    if (!existsSync(inputFilePath) && from) {
        Logger.error("File \"".concat(inputFilePath, "\" not found"));
        process.exit(1);
    }
    if (!existsSync(genTypeFilePath) && genType) {
        Logger.error("File \"".concat(genTypeFilePath, "\" not found"));
        process.exit(1);
    }
    if (diff) {
        if (diff.length !== 2) {
            Logger.error("\"--diff\" option requires two languages");
            process.exit(1);
        }
        var lang1 = diff[0], lang2 = diff[1];
        var lang1File = path.join(process.cwd(), dir, "".concat(lang1, ".json"));
        var lang2File = path.join(process.cwd(), dir, "".concat(lang2, ".json"));
        if (!existsSync(lang1File)) {
            Logger.error("File \"".concat(lang1File, "\" not found"));
            process.exit(1);
        }
        if (!existsSync(lang2File)) {
            Logger.error("File \"".concat(lang2File, "\" not found"));
            process.exit(1);
        }
    }
}
