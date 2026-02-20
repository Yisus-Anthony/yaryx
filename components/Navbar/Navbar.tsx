"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

const items = [
  { slug: "diseno-web", title: "Diseño web", desc: "Webs rápidas, modernas y responsive" },
  { slug: "seo", title: "Posicionamiento SEO", desc: "Ranking en Google y tráfico orgánico" },
  { slug: "diseno-grafico", title: "Diseño gráfico", desc: "Piezas, identidad visual y branding" },
  { slug: "redes-sociales", title: "Gestión de redes sociales", desc: "Contenido, calendario y crecimiento" },
  { slug: "diseno-de-logo", title: "Diseño de logo", desc: "Marca sólida, memorable y consistente" },
  { slug: "marketing", title: "Marketing", desc: "Estrategia, embudos y conversión" },
  { slug: "diseno-de-anuncios", title: "Diseño de anuncios", desc: "Creatividades para Meta/Google Ads" },
];

function getLocaleFromPath(pathname: string): "es" | "en" {
  return pathname.startsWith("/en") ? "en" : "es";
}

function replaceLocale(pathname: string, next: "es" | "en") {
  if (/^\/(es|en)(\/|$)/.test(pathname)) {
    return pathname.replace(/^\/(es|en)(\/|$)/, `/${next}$2`);
  }
  return `/${next}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const locale = getLocaleFromPath(pathname);
  const nextLocale = locale === "es" ? "en" : "es";
  const switchLabel = locale === "es" ? "English" : "Español";

  const href = (p: string) => `/${locale}${p}`;

  const switchLocale = () => {
    document.cookie = `yaryx_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.push(replaceLocale(pathname, nextLocale));
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 980) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className={styles.nav} ref={(n) => (rootRef.current = n)}>
      <div className={`${styles.inner} container`}>
        <a className={styles.brand} href={href("")}>
          <img className={styles.icon} src="/assets/logo.svg" alt="Yaryx" />
          <span className={styles.name}>yarix</span>
        </a>

        <button
          className={styles.burger}
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls="navMenu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav id="navMenu" className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}>
          <a className={styles.link} href={href("")} onClick={() => setMenuOpen(false)}>INICIO</a>
          <a className={styles.link} href={href("/servicios/diseno-web")} onClick={() => setMenuOpen(false)}>DISEÑO WEB</a>

          <div className={`${styles.dropdown} ${megaOpen ? styles.open : ""}`}>
            <button
              className={`${styles.link} ${styles.linkBtn}`}
              type="button"
              aria-haspopup="true"
              aria-expanded={megaOpen}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMegaOpen((v) => !v);
              }}
            >
              SERVICIOS <span className={styles.caret}>▾</span>
            </button>

            <div className={styles.mega} role="menu" aria-label="Servicios">
              <div className={styles.grid}>
                {items.map((it) => (
                  <a
                    key={it.slug}
                    role="menuitem"
                    className={styles.item}
                    href={href(`/servicios/${it.slug}`)}
                    onClick={() => {
                      setMegaOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <span className={styles.itemTitle}>{it.title}</span>
                    <span className={styles.itemDesc}>{it.desc}</span>
                  </a>
                ))}

                <a
                  className={styles.cta}
                  href={href("/contacto")}
                  onClick={() => {
                    setMegaOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <span className={styles.ctaTitle}>¿Listo para cotizar?</span>
                  <span className={styles.ctaDesc}>Te respondo con tiempos y precio.</span>
                  <span className={styles.ctaBtn}>Solicitar cotización →</span>
                </a>
              </div>
            </div>
          </div>

          <a className={styles.link} href={href("/contacto")} onClick={() => setMenuOpen(false)}>CONTACTO</a>

          <button
            type="button"
            onClick={() => {
              switchLocale();
              setMenuOpen(false);
              setMegaOpen(false);
            }}
            className={`${styles.link} ${styles.langBtn}`}
          >
            {switchLabel}
          </button>
        </nav>
      </div>
    </header>
  );
}