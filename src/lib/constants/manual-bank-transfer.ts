export const MANUAL_BANK_TRANSFER = {
    bankName: process.env.BANK_NAME,
    accountHolder: process.env.BANK_ACCOUNT_HOLDER,
    clabe: process.env.BANK_CLABE,
    accountNumber: process.env.BANK_ACCOUNT_NUMBER,
    cardReference: process.env.BANK_CARD_REFERENCE,
    instructions: [
        "Realiza la transferencia SPEI por el monto exacto de tu pedido.",
        "Usa tu referencia de pedido en el concepto de pago.",
        "Tu pedido se aparta como pendiente de pago y se confirma cuando validemos el depósito.",
        "Si el monto o la referencia no coinciden, la conciliación puede tardar más.",
    ],
} as const