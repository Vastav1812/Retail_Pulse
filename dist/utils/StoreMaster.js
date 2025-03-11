"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStoreMaster = loadStoreMaster;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let storeMasterData = null;
function loadStoreMaster() {
    if (storeMasterData)
        return storeMasterData;
    const csvPath = path_1.default.join(__dirname, 'StoreMaster.csv');
    const content = fs_1.default.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const result = {};
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(col => col.trim());
        if (cols.length < 3)
            continue;
        const record = {
            areaCode: cols[0],
            storeName: cols[1],
            storeID: cols[2]
        };
        result[record.storeID] = record;
    }
    storeMasterData = result;
    return result;
}
