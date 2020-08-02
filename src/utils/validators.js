export const requiredText = input => input.trim().length > 0;
export const requiredNumber = input => !isNaN(input);
export const minValue = min => (input => Number(input) >= min);
export const isEmail = input => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input);

export const combineAnd = (a, b) => (input => a(input) && b(input));
