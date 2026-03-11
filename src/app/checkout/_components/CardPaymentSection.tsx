"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CardPaymentSection.module.css";
import type { CheckoutCustomerData } from "./CheckoutCustomerForm";

type Props = {
  amount: number;
  customer: CheckoutCustomerData;
  onResult: (result: { type: "success" | "error"; message: string }) => void;
};

type MercadoPagoConstructor = new (
  publicKey: string,
  options?: { locale?: string },
) => {
  bricks: () => {
    create: (
      brickType: "cardPayment",
      containerId: string,
      settings: Record<string, unknown>,
    ) => Promise<{ unmount: () => void }>;
  };
};

type CardBrickFormData = {
  token?: string;
  issuer_id?: string | number | null;
  issuerId?: string | number | null;
  payment_method_id?: string;
  paymentMethodId?: string;
  installments?: number | string | null;
  payer?: {
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
};

declare global {
  interface Window {
    MercadoPago?: MercadoPagoConstructor;
  }
}

const MP_BRICK_CONTAINER_ID = "mp-card-payment-brick";

function cleanString(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function loadMercadoPagoScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.MercadoPago) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[data-mercadopago-sdk="true"]',
    ) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("No se pudo cargar Mercado Pago")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.dataset.mercadopagoSdk = "true";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("No se pudo cargar Mercado Pago"));
    document.body.appendChild(script);
  });
}

function clearBrickContainer() {
  const container = document.getElementById(MP_BRICK_CONTAINER_ID);
  if (container) {
    container.innerHTML = "";
  }
}

export default function CardPaymentSection({
  amount,
  customer,
  onResult,
}: Props) {
  const brickRef = useRef<{ unmount: () => void } | null>(null);
  const submittingRef = useRef(false);
  const onResultRef = useRef(onResult);
  const customerRef = useRef(customer);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    customerRef.current = customer;
  }, [customer]);

  const normalizedEmail = useMemo(
    () => cleanString(customer.email) ?? "",
    [customer.email],
  );

  const validationMessage = useMemo(() => {
    if (!publicKey) {
      return "Falta configurar NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY.";
    }

    if (!normalizedEmail) {
      return "Captura tu correo para habilitar el formulario de tarjeta.";
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return "El monto del pago no es válido.";
    }

    return null;
  }, [publicKey, normalizedEmail, amount]);

  const canRenderBrick = !validationMessage;

  useEffect(() => {
    let cancelled = false;
    let localController: { unmount: () => void } | null = null;

    async function mountBrick() {
      if (!canRenderBrick || !publicKey) {
        setReady(false);
        setLoading(false);

        try {
          brickRef.current?.unmount?.();
        } catch (error) {
          console.warn("Error desmontando Brick:", error);
        } finally {
          brickRef.current = null;
          clearBrickContainer();
        }

        return;
      }

      setLoading(true);
      setReady(false);

      try {
        await loadMercadoPagoScript();

        if (cancelled) return;

        if (!window.MercadoPago) {
          throw new Error("SDK de Mercado Pago no disponible");
        }

        try {
          brickRef.current?.unmount?.();
        } catch (error) {
          console.warn("Error desmontando Brick previo:", error);
        } finally {
          brickRef.current = null;
          clearBrickContainer();
        }

        const mp = new window.MercadoPago(publicKey, {
          locale: "es-MX",
        });

        const bricksBuilder = mp.bricks();

        const controller = await bricksBuilder.create(
          "cardPayment",
          MP_BRICK_CONTAINER_ID,
          {
            initialization: {
              amount,
              payer: {
                email: normalizedEmail,
              },
            },
            customization: {
              visual: {
                style: {
                  theme: "default",
                },
              },
            },
            callbacks: {
              onReady: () => {
                if (cancelled) return;
                setReady(true);
                setLoading(false);
              },
              onSubmit: async (cardFormData: CardBrickFormData) => {
                if (submittingRef.current) {
                  throw new Error("Ya hay un pago en proceso.");
                }

                const latestCustomer = customerRef.current;

                const customerEmail = cleanString(latestCustomer.email);
                const customerName = cleanString(latestCustomer.name);
                const customerPhone = cleanString(latestCustomer.phone);

                if (!customerEmail) {
                  onResultRef.current({
                    type: "error",
                    message: "Falta el correo del comprador.",
                  });
                  throw new Error("Falta el correo del comprador.");
                }

                submittingRef.current = true;

                try {
                  const payload = {
                    token: cleanString(cardFormData?.token),
                    issuer_id:
                      cardFormData?.issuer_id ?? cardFormData?.issuerId ?? null,
                    payment_method_id:
                      cleanString(cardFormData?.payment_method_id) ??
                      cleanString(cardFormData?.paymentMethodId),
                    installments: Number(cardFormData?.installments ?? 1),
                    payer: {
                      email: customerEmail,
                      identification:
                        cleanString(
                          cardFormData?.payer?.identification?.type,
                        ) &&
                        cleanString(cardFormData?.payer?.identification?.number)
                          ? {
                              type: cleanString(
                                cardFormData.payer?.identification?.type,
                              ),
                              number: cleanString(
                                cardFormData.payer?.identification?.number,
                              ),
                            }
                          : undefined,
                    },
                    customer: {
                      name: customerName,
                      phone: customerPhone,
                    },
                  };

                  console.log("CARD BRICK DATA:", cardFormData);
                  console.log("CARD REQUEST PAYLOAD:", payload);

                  const res = await fetch("/api/checkout/card", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  const data = await res.json().catch(() => ({}));

                  console.log("CARD RESPONSE STATUS:", res.status);
                  console.log("CARD RESPONSE DATA:", data);

                  if (!res.ok || !data?.ok) {
                    const message =
                      data?.error ?? "No se pudo procesar el pago con tarjeta";

                    onResultRef.current({
                      type: "error",
                      message,
                    });

                    throw new Error(message);
                  }

                  onResultRef.current({
                    type: "success",
                    message:
                      data.paymentStatus === "APPROVED"
                        ? `Pago aprobado. Referencia: ${data.reference}`
                        : `Pago recibido con estado ${data.mercadoPagoStatus ?? "pendiente"}. Referencia: ${data.reference}`,
                  });

                  return data;
                } finally {
                  submittingRef.current = false;
                }
              },
              onError: (error: unknown) => {
                console.error("CARD BRICK ERROR:", error);

                const message =
                  error instanceof Error
                    ? error.message
                    : "Error en el formulario de tarjeta";

                onResultRef.current({
                  type: "error",
                  message,
                });
              },
            },
          },
        );

        if (cancelled) {
          try {
            controller.unmount?.();
          } catch (error) {
            console.warn("Error desmontando Brick cancelado:", error);
          }
          clearBrickContainer();
          return;
        }

        localController = controller;
        brickRef.current = controller;
      } catch (error) {
        console.error("ERROR MONTANDO CARD BRICK:", error);

        if (!cancelled) {
          setLoading(false);
          setReady(false);

          const message =
            error instanceof Error
              ? error.message
              : "No se pudo montar el formulario de tarjeta";

          onResultRef.current({
            type: "error",
            message,
          });
        }
      }
    }

    mountBrick();

    return () => {
      cancelled = true;

      try {
        localController?.unmount?.();
      } catch (error) {
        console.warn("Error desmontando Brick en cleanup:", error);
      } finally {
        if (brickRef.current === localController) {
          brickRef.current = null;
        }
        clearBrickContainer();
      }
    };
  }, [amount, canRenderBrick, normalizedEmail, publicKey]);

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Pagar con tarjeta</h2>
        <p>Pago embebido dentro de tu sitio con Mercado Pago.</p>
      </div>

      {validationMessage ? (
        <div className={styles.notice}>{validationMessage}</div>
      ) : null}

      {loading && canRenderBrick ? (
        <div className={styles.notice}>Cargando formulario…</div>
      ) : null}

      <div
        id={MP_BRICK_CONTAINER_ID}
        className={!ready ? styles.hiddenContainer : styles.container}
      />
    </section>
  );
}
