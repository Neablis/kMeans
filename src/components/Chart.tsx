import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Dot,
} from 'recharts';

import KMeans, { Dataset, Point } from '../utils/kMeans';

const initialData = [];

for (let x = 0; x < 1000; x++) {
  initialData.push({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
    partition: null,
  });
}

const PARTITIONS = 5;

const COLORS = ['#FF0000', '#CCCC00', '#00FF00', '#0000FF', '#808080'];

const kMeansGen = KMeans(initialData, PARTITIONS);

const CentroidDot = (values) => {
  const { cx, cy } = values;

  console.log({ values });
  return <Dot cx={cx} cy={cy} fill="black" r={15} />;
};

const Spreadsheet = () => {
  const [points, setPoints] = useState<Dataset[]>([]);
  const [centroidPoints, setCentroids] = useState<Point[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { value, done } = kMeansGen.next();

      if (done) {
        clearInterval(interval);
      } else {
        const { dataset, centroids } = value;

        setPoints(dataset);
        setCentroids(centroids);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" />
        <YAxis type="number" dataKey="y" />
        <Scatter name="Data Points" data={points} fill="#8884d8">
          {points.map((entry, index) => {
            const { partition } = entry;

            const cellColor = partition ? COLORS[partition] : COLORS[0];
            return <Cell key={`cell-${index}`} fill={cellColor} />;
          })}
        </Scatter>
        <Scatter
          name="Centroid Points"
          data={centroidPoints}
          fill="#8884d8"
          shape={<CentroidDot />}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default Spreadsheet;
