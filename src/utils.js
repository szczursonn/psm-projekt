import { CURRENCY_UNIT } from "./consts";

export const getUserLocale = () => navigator.language || 'en-us';

export const formatCurrency = (amount) => new Intl.NumberFormat(getUserLocale(), { style: 'currency', currency: CURRENCY_UNIT, maximumFractionDigits: 0 }).format(amount);