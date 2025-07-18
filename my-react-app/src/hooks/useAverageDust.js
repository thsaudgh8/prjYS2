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

<<<<<<< HEAD
export default useAverageDust;
=======
export default useAverageDust;
>>>>>>> f6330e6e1a2ca254b6b87a7a668c8db2cbcf7a64
