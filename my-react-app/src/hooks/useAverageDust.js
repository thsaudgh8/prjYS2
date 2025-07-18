import { useEffect, useState } from 'react';
import { fetchGyeonggiAvgDust } from '../services/dustService';

function useAverageDust() {
  const [avgData, setAvgData] = useState(null);

  useEffect(() => {
    async function getData() {
      const avg = await fetchGyeonggiAvgDust();
      setAvgData(avg);
    }
    getData();
  }, []);

  return avgData;
}

export default useAverageDust;