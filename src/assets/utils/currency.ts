export const formatYen = (value: number) => new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
}).format(value);