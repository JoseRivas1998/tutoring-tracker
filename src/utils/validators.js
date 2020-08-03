export const requiredText = input => input.trim().length > 0;
export const requiredNumber = input => !isNaN(input);
export const minValue = min => (input => Number(input) >= min);
export const isEmail = input => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input);
export const minTime = min => (input => input.year(0).month(0).date(0).startOf('minute').isSameOrAfter(min.year(0).month(0).date(0)));
export const maxTime = max => (input => input.year(0).month(0).date(0).startOf('minute').isSameOrBefore(max.year(0).month(0).date(0)));

export const combineAnd = (a, b) => (input => a(input) && b(input));
