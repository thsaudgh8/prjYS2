<<<<<<< HEAD
=======
// useLocation.js

>>>>>>> f6330e6e1a2ca254b6b87a7a668c8db2cbcf7a64
import { useState, useEffect } from "react";

export function useLocation() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("🚫 이 브라우저는 위치 정보를 지원하지 않습니다.");
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("📍 현재 위치 좌표:", lat, lon);

        setLocation({ lat, lon });
        setLoading(false);
      },
      (err) => {
        console.log("❌ 위치 정보 가져오기 실패:", err.message);
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true, // 🎯 더 정확한 위치 요청 (가능한 경우에만)
        timeout: 10000,           // 응답 최대 10초까지 대기
        maximumAge: 0             // 캐시된 위치 정보 사용하지 않음
      }
    );
  }, []);

  return { location, loading, error };
}
