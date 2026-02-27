import Link from "next/link";
import styles from "./ButtonLink.module.css";

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim();

  if (external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}