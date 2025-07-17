import { useEffect, useState } from 'react';

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export default function useAddressFromCoords(lat, lon) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchAddress = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
          {
            headers: {
              Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
          }
        );
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          const region = data.documents[0];
          setAddress({
            sido: region.region_1depth_name,
            sigungu: region.region_2depth_name,
          });
        } else {
          setError('주소 정보가 없습니다.');
          setAddress(null);
        }
      } catch (err) {
        console.error('주소 변환 실패:', err);
        setError(err.message);
        setAddress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [lat, lon]);

  return { address, loading, error };
}
