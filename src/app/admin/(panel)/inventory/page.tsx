"use client";

import { useEffect, useMemo, useState } from "react";

type InventoryItem = {
  id: string;
  sku: string | null;
  name: string;
  stock: number;
  price: number;
  isActive: boolean;
  coverPublicId: string;
  imageUrl: string | null;
  category: {
    name: string;
  };
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await fetch("/api/inventario", { cache: "no-store" });

        if (!res.ok) {
          throw new Error("No se pudo obtener el inventario");
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const totalProducts = data.length;

  const totalPieces = useMemo(() => {
    return data.reduce((acc, item) => acc + item.stock, 0);
  }, [data]);

  const totalInventoryValue = useMemo(() => {
    return data.reduce((acc, item) => acc + item.stock * item.price, 0);
  }, [data]);

  return (
    <div style={pageStyle}>
      <div className="no-print" style={topBarStyle}>
        <div>
          <h1 style={titleStyle}>Inventario actual</h1>
          <p style={subtitleStyle}>
            Consulta de piezas disponibles, precios y fotografía del producto.
          </p>
        </div>

        <button onClick={() => window.print()} style={printButtonStyle}>
          Imprimir / Guardar PDF
        </button>
      </div>

      <div style={reportHeaderStyle}>
        <div>
          <h2 style={reportTitleStyle}>Reporte de inventario</h2>
          <p style={reportDateStyle}>
            Fecha: {new Date().toLocaleDateString("es-MX")}
          </p>
        </div>

        <div className="summary-grid" style={summaryGridStyle}>
          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Productos</span>
            <strong style={summaryValueStyle}>{totalProducts}</strong>
          </div>

          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Piezas totales</span>
            <strong style={summaryValueStyle}>{totalPieces}</strong>
          </div>

          <div style={summaryCardStyle}>
            <span style={summaryLabelStyle}>Valor inventario</span>
            <strong style={summaryValueStyle}>
              {formatCurrency(totalInventoryValue)}
            </strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={loadingBoxStyle}>Cargando inventario...</div>
      ) : (
        <>
          {/* TABLA PARA PANTALLA */}
          <div className="screen-only" style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Foto</th>
                  <th style={thStyle}>SKU</th>
                  <th style={thStyle}>Producto</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Piezas</th>
                  <th style={thStyle}>Precio</th>
                  <th style={thStyle}>Activo</th>
                  <th style={thStyle}>Importe stock</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => {
                  const stockValue = item.stock * item.price;

                  return (
                    <tr key={item.id}>
                      <td style={tdStyle}>
                        <div style={imageBoxStyle}>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={imageStyle}
                            />
                          ) : (
                            <span style={imagePlaceholderStyle}>Sin foto</span>
                          )}
                        </div>
                      </td>

                      <td style={tdStyle}>{item.sku ?? "-"}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.category?.name ?? "-"}</td>
                      <td style={tdStyle}>{item.stock}</td>
                      <td style={tdStyle}>{formatCurrency(item.price)}</td>
                      <td style={tdStyle}>{item.isActive ? "Sí" : "No"}</td>
                      <td style={tdStyle}>{formatCurrency(stockValue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLA ESPECIAL PARA IMPRESIÓN */}
          <div className="print-only" style={printTableWrapperStyle}>
            <table style={printTableStyle}>
              <thead>
                <tr>
                  <th style={printThStyle}>Foto</th>
                  <th style={printThStyle}>SKU</th>
                  <th style={printThStyle}>Producto</th>
                  <th style={printThStyle}>Piezas</th>
                  <th style={printThStyle}>Precio</th>
                  <th style={printThStyle}>Importe</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => {
                  const stockValue = item.stock * item.price;

                  return (
                    <tr key={`print-${item.id}`}>
                      <td style={printTdStyle}>
                        <div style={printImageBoxStyle}>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={printImageStyle}
                            />
                          ) : (
                            <span style={printPlaceholderStyle}>Sin foto</span>
                          )}
                        </div>
                      </td>

                      <td style={printTdStyle}>{item.sku ?? "-"}</td>
                      <td style={printTdStyle}>
                        <div style={printProductNameStyle}>{item.name}</div>
                        <div style={printCategoryStyle}>
                          {item.category?.name ?? "-"}
                        </div>
                      </td>
                      <td style={printTdStyle}>{item.stock}</td>
                      <td style={printTdStyle}>{formatCurrency(item.price)}</td>
                      <td style={printTdStyle}>{formatCurrency(stockValue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#f8fafc",
  minHeight: "100%",
};

const topBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "28px",
  fontWeight: 700,
  color: "#0f172a",
};

const subtitleStyle: React.CSSProperties = {
  marginTop: "6px",
  marginBottom: 0,
  color: "#475569",
  fontSize: "14px",
};

const printButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#0f172a",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};

const reportHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const reportTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 700,
  color: "#111827",
};

const reportDateStyle: React.CSSProperties = {
  marginTop: "6px",
  color: "#6b7280",
  fontSize: "14px",
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  minWidth: "320px",
  flex: 1,
};

const summaryCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "14px 16px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const summaryLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "6px",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#111827",
};

const loadingBoxStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "24px",
  color: "#374151",
};

const tableWrapperStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  overflowX: "auto",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1200px",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f8fafc",
  color: "#334155",
  fontSize: "13px",
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "middle",
  fontSize: "14px",
  color: "#111827",
};

const imageBoxStyle: React.CSSProperties = {
  width: "88px",
  height: "88px",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #d1d5db",
  backgroundColor: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const imagePlaceholderStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
};

/* impresión */
const printTableWrapperStyle: React.CSSProperties = {
  display: "none",
};

const printTableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
};

const printThStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "1px solid #d1d5db",
  fontSize: "11px",
  fontWeight: 700,
  color: "#111827",
};

const printTdStyle: React.CSSProperties = {
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "middle",
  fontSize: "10px",
  color: "#111827",
  wordBreak: "break-word",
};

const printImageBoxStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const printImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const printPlaceholderStyle: React.CSSProperties = {
  fontSize: "9px",
  color: "#6b7280",
  textAlign: "center",
};

const printProductNameStyle: React.CSSProperties = {
  fontWeight: 600,
  lineHeight: 1.25,
};

const printCategoryStyle: React.CSSProperties = {
  marginTop: "2px",
  fontSize: "9px",
  color: "#6b7280",
};
