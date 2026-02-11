export const formatCurrency = (amount: number, currency: string = 'BDT') => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0
    }).format(amount);
};

export const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(date));
};
