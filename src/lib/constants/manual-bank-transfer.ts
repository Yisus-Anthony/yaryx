export const MANUAL_BANK_TRANSFER = {
    bankName: "BANAMEX",
    accountHolder: "TU REFACCIONARIA",
    clabe: "002180701148903574",
    accountNumber: "4890357",
    cardReference: "SIN REFERENCIA",
    instructions: [
        "Realiza la transferencia SPEI por el monto exacto de tu pedido.",
        "Usa tu referencia de pedido en el concepto de pago.",
        "Tu pedido se aparta como pendiente de pago y se confirma cuando validemos el depósito.",
        "Si el monto o la referencia no coinciden, la conciliación puede tardar más.",
    ],
} as const;