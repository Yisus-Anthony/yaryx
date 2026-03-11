export const MANUAL_BANK_TRANSFER = {
    bankName: "BBVA México",
    accountHolder: "TU NOMBRE O RAZÓN SOCIAL",
    clabe: "012345678901234567",
    accountNumber: "1234567890",
    cardReference: "1234",
    instructions: [
        "Realiza la transferencia SPEI por el monto exacto de tu pedido.",
        "Usa tu referencia de pedido en el concepto de pago.",
        "Tu pedido se aparta como pendiente de pago y se confirma cuando validemos el depósito.",
        "Si el monto o la referencia no coinciden, la conciliación puede tardar más.",
    ],
} as const;