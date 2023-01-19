const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.abs(x2 - x1) + Math.abs(y2 - y1);

const ITERATIONS = 20;

interface Point {
  x: number;
  y: number;
}
 
interface Dataset extends Point {
  partition: number;
}

interface KMeans {
  dataset: Dataset[];
  centroids: Point[];
}

const computeNewCentroids = (values: Dataset[]): Point[] => {
  const centroids: { [key: number]: Dataset[] } = {};

  values.forEach((data) => {
    if (!centroids[data.partition]) {
      centroids[data.partition] = [];
    }

    centroids[data.partition].push(data);
  });

  return Object.keys(centroids).map((key: string) => {
    const dataInSet: Dataset[] = centroids[key];

    let [x, y] = [0, 0];

    dataInSet.forEach((data) => {
      x += data.x;
      y += data.y;
    });

    return {
      x: Math.floor(x / dataInSet.length),
      y: Math.floor(y / dataInSet.length),
    };
  });
};

const computePartitionAssignment = (
  values: Dataset[],
  centroids: Point[],
): { newDataset: Dataset[]; changes: boolean } => {
  let changes = false;

  const newDataset = values.map((point) => {
    let closest = {
      centroid: null,
      distance: Number.MAX_VALUE,
    };

    centroids.forEach((centroid: Point, idx) => {
      const distanceToCentroid = distance(centroid.x, centroid.y, point.x, point.y);

      if (distanceToCentroid < closest.distance) {
        closest = {
          centroid: idx,
          distance: distanceToCentroid,
        };
      }
    });

    if (point.partition !== closest.centroid) {
      changes = true;
    }

    return {
      ...point,
      partition: closest.centroid,
    };
  });

  return {
    newDataset,
    changes,
  };
};

const KMeans = function* (dataset: Dataset[], partitions: number): IterableIterator<KMeans> {
  let centroids: Point[] = [];

  // Generate initial partitions
  for (let x = 0; x < partitions; x++) {
    centroids.push({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    });
  }

  for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    const { changes, newDataset } = computePartitionAssignment(dataset, centroids);

    if (!changes) {
      iteration = Number.MAX_VALUE;
    }

    centroids = computeNewCentroids(newDataset);

    yield {
      dataset: newDataset,
      centroids,
    };
  }
};

export type { Point, Dataset };

export default KMeans;
