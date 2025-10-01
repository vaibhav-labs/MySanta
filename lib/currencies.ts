export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
] as const

export type CurrencyCode = typeof CURRENCIES[number]["code"]

export function formatPrice(price: number, currencyCode: CurrencyCode = "USD"): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode)

  if (!currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  // Special formatting for different currencies
  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currencyCode,
  }

  // For Japanese Yen and Korean Won, don't show decimal places
  if (currencyCode === "JPY" || currencyCode === "KRW") {
    formatOptions.minimumFractionDigits = 0
    formatOptions.maximumFractionDigits = 0
  }

  try {
    return new Intl.NumberFormat("en-US", formatOptions).format(price)
  } catch (error) {
    // Fallback to manual formatting if Intl fails
    return `${currency.symbol}${price.toLocaleString()}`
  }
}

export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode)
  return currency?.symbol || "$"
}