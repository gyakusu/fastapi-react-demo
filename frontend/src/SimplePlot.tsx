import React from "react";

export type PlotData = {
  x: number[];
  y?: number[];
  label: string;
};

export const SimplePlot: React.FC<{ data: PlotData[] }>
  = ({ data }) => {
  // SVGサイズ
  const width = 400;
  const height = 200;
  const padding = 30;

  // x/yの全データ範囲を取得
  const allX = data.flatMap(d => d.x);
  const allY = data.flatMap(d => d.y ?? []);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = allY.length ? Math.min(...allY) : 0;
  const maxY = allY.length ? Math.max(...allY) : 1;

  // 座標変換
  const scaleX = (x: number) => padding + (x - minX) / (maxX - minX) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - (y - minY) / (maxY - minY) * (height - 2 * padding);

  return (
    <svg width={width} height={height} style={{ background: '#fafafa', border: '1px solid #eee' }}>
      {/* 軸 */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#888" />
      {/* データ系列 */}
      {data.map((d, i) => d.y && (
        <polyline
          key={d.label}
          fill="none"
          stroke={["#1976d2", "#d32f2f", "#388e3c", "#fbc02d"][i % 4]}
          strokeWidth={2}
          points={d.x.map((x, j) => `${scaleX(x)},${scaleY(d.y![j])}`).join(' ')}
        />
      ))}
      {/* 凡例 */}
      {data.map((d, i) => (
        <text key={d.label} x={padding + 10} y={padding + 18 * i} fontSize={13} fill={["#1976d2", "#d32f2f", "#388e3c", "#fbc02d"][i % 4]}>{d.label}</text>
      ))}
    </svg>
  );
};
