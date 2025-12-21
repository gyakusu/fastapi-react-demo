import React from "react";

export type PlotData = {
    x: number[];
    y?: number[];
    label: string;
};

export const SimplePlot: React.FC<{ data: PlotData[], theme?: 'modern' }>
    = ({ data, theme }) => {
        // SVGサイズ
        const width = 800; // 横幅拡大
        const height = 320;
        const padding = 40;
        const legendWidth = 120; // 凡例用余白

        // x/yの全データ範囲を取得
        const allX = data.flatMap(d => d.x);
        const allY = data.flatMap(d => d.y ?? []);
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = allY.length ? Math.min(...allY) : 0;
        const maxY = allY.length ? Math.max(...allY) : 1;

        // 座標変換
        const scaleX = (x: number) => padding + (x - minX) / (maxX - minX) * (width - 2 * padding - legendWidth);
        const scaleY = (y: number) => height - padding - (y - minY) / (maxY - minY) * (height - 2 * padding);

        // 軸ラベル・グリッド・点・凡例
        return (
            <svg width={width} height={height} style={{ background: theme === 'modern' ? 'linear-gradient(120deg,#f8fafc,#e3e7ed 80%)' : '#fafafa', border: '1px solid #eee', borderRadius: 8 }}>
                {/* グリッド */}
                {[0.25, 0.5, 0.75, 1].map(f => (
                    <g key={f}>
                        <line x1={padding} y1={scaleY(minY + (maxY - minY) * f)} x2={width - padding} y2={scaleY(minY + (maxY - minY) * f)} stroke="#e0e0e0" />
                        <line y1={padding} x1={scaleX(minX + (maxX - minX) * f)} y2={height - padding} x2={scaleX(minX + (maxX - minX) * f)} stroke="#e0e0e0" />
                    </g>
                ))}
                {/* 軸 */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" strokeWidth={2} />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#888" strokeWidth={2} />
                {/* 軸ラベル */}
                <text x={width / 2} y={height - 5} textAnchor="middle" fontSize={15} fill="#555">x</text>
                <text x={10} y={height / 2} textAnchor="middle" fontSize={15} fill="#555" transform={`rotate(-90 10,${height / 2})`}>y</text>
                {/* データ系列 */}
                {data.map((d, i) => d.y && (
                    <g key={d.label}>
                        <polyline
                            fill="none"
                            stroke={["#1976d2", "#d32f2f", "#388e3c", "#fbc02d"][i % 4]}
                            strokeWidth={2.5}
                            points={d.x.map((x, j) => `${scaleX(x)},${scaleY(d.y![j])}`).join(' ')}
                        />
                        {/* 点 */}
                        {d.x.map((x, j) => (
                            <g key={j}>
                                <circle cx={scaleX(x)} cy={scaleY(d.y![j])} r={2.5} fill={["#1976d2", "#d32f2f", "#388e3c", "#fbc02d"][i % 4]} opacity={0.7} />
                                {/* 値ラベル（y座標）を表示。点が密な場合は間引き */}
                                {d.x.length <= 20 || j % Math.ceil(d.x.length / 20) === 0 ? (
                                    <text x={scaleX(x)} y={scaleY(d.y![j]) - 8} fontSize={11} fill={["#1976d2", "#d32f2f", "#388e3c", "#fbc02d"][i % 4]} textAnchor="middle">
                                        {d.y![j].toFixed(2)}
                                    </text>
                                ) : null}
                            </g>
                        ))}
                    </g>
                ))}
                {/* 凡例 */}
                {data.map((d, i) => (
                    <g key={d.label}>
                        <rect x={width - padding - legendWidth + 10} y={padding + 24 * i - 12} width={18} height={6} fill={["#1976d2", "#d32f2f", "#388e3c", "#fbc02d"][i % 4]} rx={2} />
                        <text x={width - padding - legendWidth + 35} y={padding + 24 * i - 4} fontSize={15} fill="#333">{d.label}</text>
                    </g>
                ))}
            </svg>
        );
    };
