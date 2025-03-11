import fs from 'fs';
import path from 'path';

export interface StoreMasterRecord {
    areaCode: string;
    storeName: string;
    storeID: string;
}

let storeMasterData: { [key: string]: StoreMasterRecord } | null = null;

export function loadStoreMaster(): { [key: string]: StoreMasterRecord } {
    if (storeMasterData) return storeMasterData;

    const csvPath = path.join(__dirname, 'StoreMaster.csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const result: { [key: string]: StoreMasterRecord } = {};

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(col => col.trim());
        if (cols.length < 3) continue;
        const record: StoreMasterRecord = {
            areaCode: cols[0],
            storeName: cols[1],
            storeID: cols[2]
        };
        result[record.storeID] = record;
    }

    storeMasterData = result;
    return result;
}
