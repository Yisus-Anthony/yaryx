"use client";

import styles from "./CheckoutCustomerForm.module.css";

export type CheckoutCustomerData = {
  name: string;
  email: string;
  phone: string;
};

type Props = {
  value: CheckoutCustomerData;
  onChange: (next: CheckoutCustomerData) => void;
};

export default function CheckoutCustomerForm({ value, onChange }: Props) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Datos del comprador</h2>
        <p>Estos datos se usan para tarjeta, OXXO y transferencia SPEI.</p>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Nombre completo</span>
          <input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="Tu nombre"
          />
        </label>

        <label className={styles.field}>
          <span>Correo electrónico</span>
          <input
            type="email"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="tu@correo.com"
          />
        </label>

        <label className={styles.field}>
          <span>Teléfono</span>
          <input
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="5512345678"
          />
        </label>
      </div>
    </section>
  );
}
