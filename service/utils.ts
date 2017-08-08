export const padStart = (
    num: any,
    len: number = 2,
    ch: string = "0"
): string => {
    let output = `${num}`;
    while (output.length < len) {
        output = `${ch}${output}`;
    }
    return output;
};

export const getFormatDate = (
    d?: string | number | Date | null,
    format: string = "YYYY-MM-DD"
): string => {
    let date: Date;
    if (/[0-9]+/.test(d as string)) {
        d = Number(d);
        date = new Date(d > 1500000000 * 100 ? Math.ceil(d / 1000) : d);
    } else if (d instanceof Date) {
        date = d;
    } else {
        date = new Date();
    }
    return format
        .replace("YYYY", date.getFullYear().toString())
        .replace("MM", padStart(date.getMonth() + 1))
        .replace("DD", padStart(date.getDate()))
        .replace("HH", padStart(date.getHours()))
        .replace("mm", padStart(date.getMinutes()))
        .replace("ss", padStart(date.getSeconds()));
};
