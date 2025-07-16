import React, { useState } from 'react';
import { fetchBusStops, fetchRoutesByStop } from '../services/busService';

const BusPage = () => {
  const [stopName, setStopName] = useState('장안문');
  const [cityCode, setCityCode] = useState('31010');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [routes, setRoutes] = useState({});

  const handleFetch = async () => {
    if (!stopName.trim() || !cityCode.trim()) {
      setError('정류장 이름과 cityCode 모두 입력하세요');
      setResult(null);
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    setRoutes({});

    try {
      const data = await fetchBusStops(stopName, cityCode);
      setResult(data);
    } catch (e) {
      setError(e.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getItemsArray = () => {
    if (!result) return [];
    const items = result.response?.body?.items?.item;
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  };

  const handleStopClick = async (nodeid) => {
    if (routes[nodeid]) return; // 이미 불러온 정류장은 다시 요청 안 함
    try {
      const data = await fetchRoutesByStop(cityCode, nodeid);
      const items = data?.response?.body?.items?.item;
      const routeList = Array.isArray(items) ? items : items ? [items] : [];
      setRoutes((prev) => ({ ...prev, [nodeid]: routeList }));
    } catch (e) {
      setRoutes((prev) => ({ ...prev, [nodeid]: [{ routeno: '정보 없음' }] }));
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        boxSizing: 'border-box',
        background: '#fafafa',
      }}
    >
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          placeholder="정류장 이름"
          value={stopName}
          onChange={(e) => setStopName(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
        />
        <input
          placeholder="cityCode"
          value={cityCode}
          onChange={(e) => setCityCode(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', width: 100 }}
        />
        <button
          onClick={handleFetch}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#1976d2',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '로딩중...' : '조회'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 20 }}>{error}</div>}

      {result && (
        <div
          style={{
            maxHeight: 500,
            overflowY: 'auto',
            background: '#fff',
            padding: 15,
            borderRadius: 6,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            width: '90%',
            maxWidth: 600,
            textAlign: 'left',
          }}
        >
          {getItemsArray().length === 0 && <div>검색 결과가 없습니다.</div>}
          {getItemsArray().map((item, idx) => (
            <div
              key={idx}
              style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 10, cursor: 'pointer' }}
              onClick={() => handleStopClick(item.nodeid)}
            >
              <div>
                <strong>정거장ID:</strong> {item.nodeid}
              </div>
              <div>
                <strong>정거장이름:</strong> {item.nodenm}
              </div>
              <div>
                <strong>정거장번호:</strong> {item.nodeno}
              </div>

              {routes[item.nodeid] && (
                <div style={{ marginTop: 8, fontSize: 14 }}>
                  <strong>경유 노선:</strong>{' '}
                  {routes[item.nodeid].length === 0
                    ? '없음'
                    : routes[item.nodeid].map((route, i) => (
                        <span key={i} style={{ marginRight: 6 }}>
                          🚌 {route.routeno}
                        </span>
                      ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusPage;
