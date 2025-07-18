import { useState, useEffect } from 'react';
import { fetchDustData } from '../services/dustService';

function useDust(city, sido) {
  const [dustData, setDustData] = useState(null);

  useEffect(() => {
    const validCity = city && city.trim() !== '' ? city : '수원';
    const validSido = sido && sido.trim() !== '' ? sido : '경기';

    async function getData() {
      const data = await fetchDustData(validCity, validSido);
      setDustData(data);
    }

    getData();
  }, [city, sido]);

  return dustData;
}

<<<<<<< HEAD
export default useDust;
=======
export default useDust;
>>>>>>> f6330e6e1a2ca254b6b87a7a668c8db2cbcf7a64
