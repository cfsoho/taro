import taro from "../data/taro.json"

export interface taroProp {
    "idx": string;
    "name": string;
    "name_zh": string;
    "desc": string;
    "ph": number
}

const addAllDigs = (numstr: string | number) => {
    if (typeof numstr == "number") {
        numstr = numstr.toString()
    }
    const result = numstr.split("").reduce((accumulator, currentValue) => {
        return accumulator + parseInt(currentValue);
    }, 0);

    return result;

}

export const getTaroInfo = (num: number | string) => {
    num = typeof num !== 'string' ? num.toString() : num;
    let ft = taro.filter((t) => { return t.idx == num })
    return ft[0];
}

export const calBirthDay = (birthday: string) => {
    // birthday: yyyy-mm-dd
    const bd_date = new Date(birthday);
    const MAX_TARO_LEN = 22;

    const yr = bd_date.getFullYear().toString()
    const tens = parseInt(yr.slice(2, 3), 10);
    const dig = parseInt(yr.slice(3, 4), 10);
    const self = tens + dig;

    let bd_sum_dig = bd_date.getFullYear() + bd_date.getMonth() + 1 + bd_date.getDate();

    bd_sum_dig = addAllDigs(bd_sum_dig);

    let int = bd_sum_dig;
    let ext = bd_sum_dig;
    if (bd_sum_dig > MAX_TARO_LEN) {
        int = addAllDigs(int);
        ext = ext - MAX_TARO_LEN;
    }

    const result = [self, ext, int];
    return result.map((n) => getTaroInfo(n));

}