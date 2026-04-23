import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, DoughnutController);

type DoughnutChartProps = {
  id: string;
  labels: string[];
  data: number[];
  colors: string[];
};

function DoughnutChart({ id, labels, data, colors }: DoughnutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}%` } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div style={{ position: 'relative', height: '180px' }}>
      <canvas
        ref={canvasRef}
        id={id}
        role="img"
        aria-label={`Doughnut chart: ${labels.map((l, i) => `${l} ${data[i]}%`).join(', ')}`}
      />
    </div>
  );
}

export default DoughnutChart;
