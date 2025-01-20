import { pastelColors } from "@config/ui";
import * as d3 from "d3";
import { useMemo } from "react";

export const getSummaryStats = (data: number[]) => {
  const sortedData = data.sort((a, b) => a - b);

  const q1 = d3.quantile(sortedData, 0.25);
  const median = d3.quantile(sortedData, 0.5);
  const q3 = d3.quantile(sortedData, 0.75);

  if (!q3 || !q1 || !median) {
    return;
  }

  const interQuantileRange = q3 - q1;
  const min = q1 - 1.5 * interQuantileRange;
  const max = q3 + 1.5 * interQuantileRange;

  return { min, q1, median, q3, max };
};

export const VerticalBox = ({
  min,
  q1,
  median,
  q3,
  max,
  width,
  stroke,
  fill,
  STROKE_WIDTH = 2,
}: {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  width: number;
  stroke: string;
  fill: string;
  STROKE_WIDTH?: number;
}) => {
  return (
    <>
      <line x1={width / 2} x2={width / 2} y1={min} y2={max} stroke={stroke} width={STROKE_WIDTH} />
      <rect x={0} y={q3} width={width} height={q1 - q3} stroke={stroke} fill={fill} />
      <line x1={0} x2={width} y1={median} y2={median} stroke={stroke} width={STROKE_WIDTH} />
    </>
  );
};

export const AxisBottom = ({
  xScale,
  TICK_LENGTH = 6,
}: {
  xScale: d3.ScaleBand<string>;
  TICK_LENGTH?: number;
}) => {
  const [min, max] = xScale.range();

  const ticks = useMemo(() => {
    return xScale.domain().map((value) => {
      const x = xScale(value);
      return {
        value,
        xOffset: (x || 0) + xScale.bandwidth() / 2,
      };
    });
  }, [xScale]);

  return (
    <>
      {/* Main horizontal line */}
      <path d={["M", min + 20, 0, "L", max - 20, 0].join(" ")} fill="none" stroke="currentColor" />

      {/* Ticks and labels */}
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

export const AxisLeft = ({
  yScale,
  pixelsPerTick,
  TICK_LENGTH = 6,
}: {
  yScale: d3.ScaleLinear<number, number>;
  pixelsPerTick: number;
  TICK_LENGTH?: number;
}) => {
  const range = yScale.range();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const ticks = useMemo(() => {
    const height = (range[0] as number) - (range[1] as number);
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale]);

  return (
    <>
      {/* Main vertical line */}
      <path d={["M", 0, range[0], "L", 0, range[1]].join(" ")} fill="none" stroke="currentColor" />
      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line x2={-TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

const MARGIN = { top: 30, right: 30, bottom: 30, left: 50 };

type BoxplotProps = {
  width: number;
  height: number;
  data: { name: string; value: number }[];
};

export const Boxplot = ({ width, height, data }: BoxplotProps) => {
  if (data.length === 0) return null;

  // The bounds (= area inside the axis) is calculated by substracting the margins from total width / height
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Compute everything derived from the dataset:
  const { chartMin, chartMax, groups } = useMemo(() => {
    const [chartMin, chartMax] = d3.extent(data.map((d) => d.value)) as [number, number];
    const groups = [...new Set(data.map((d) => d.name))];
    return { chartMin, chartMax, groups };
  }, [data]);

  // Compute scales
  const yScale = d3.scaleLinear().domain([chartMin, chartMax]).range([boundsHeight, 0]);
  const xScale = d3.scaleBand().range([0, boundsWidth]).domain(groups).padding(0.25);

  // Build the box shapes
  const allShapes = groups.map((group, i) => {
    const groupData = data.filter((d) => d.name === group).map((d) => d.value);
    const sumStats = getSummaryStats(groupData);

    if (!sumStats) {
      return null;
    }

    const { min, q1, median, q3, max } = sumStats;

    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
      <g key={i} transform={`translate(${xScale(group)},0)`}>
        <VerticalBox
          width={xScale.bandwidth()}
          q1={yScale(q1)}
          median={yScale(median)}
          q3={yScale(q3)}
          min={yScale(min)}
          max={yScale(max)}
          stroke="black"
          fill={group === "Disgust" ? pastelColors.red : pastelColors.green}
        />
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <title>Boxplot</title>
        <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
          {allShapes}
          <AxisLeft yScale={yScale} pixelsPerTick={30} />
          {/* X axis uses an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} />
          </g>
        </g>
      </svg>
    </div>
  );
};
