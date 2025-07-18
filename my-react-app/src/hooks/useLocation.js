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
      }
    );
  }, []);

  return { location, loading, error };
}
  