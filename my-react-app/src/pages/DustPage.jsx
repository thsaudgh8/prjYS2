import { useLocation } from '../hooks/useLocation';
import useAddressFromCoords from '../hooks/useAddressFromCoords';
import useDust from '../hooks/useDust';
import useAverageDust from '../hooks/useAverageDust';
import DustInfo from '../components/DustInfo';
import AverageDustCard from '../components/AverageDustCard';

function DustPage() {
  const { location, loading: locLoading, error: locError } = useLocation();

<<<<<<< HEAD
=======
  // location이 null일 수도 있으니 안전하게 할당
>>>>>>> f6330e6e1a2ca254b6b87a7a668c8db2cbcf7a64
  const lat = location?.lat;
  const lon = location?.lon;

  const { address, loading: addrLoading, error: addrError } = useAddressFromCoords(lat, lon);

  const userCity = address?.sigungu;
  const userProvince = address?.sido;

  const localDust = useDust(userCity, userProvince);
  const avgDust = useAverageDust();

  const loading = locLoading || addrLoading;
  const error = locError || addrError;

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center' }}>현위치 기반 미세먼지 정보</h1>
      {loading && <p style={{ textAlign: 'center' }}>위치 정보를 불러오는 중...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>오류 발생: {error}</p>}
      {!loading && !error && userCity && userProvince && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            paddingTop: '1rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              flex: 3,
              border: '1px solid #ccc',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              backgroundColor: '#fff',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{userCity} 미세먼지 정보</h3>
            <DustInfo data={localDust} />
          </div>

          <div
            style={{
              flex: 4,
              border: '1px solid #ccc',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              backgroundColor: '#fff',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{userProvince} 평균</h3>
            <AverageDustCard data={avgDust} />
          </div>
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
export default DustPage;
=======
export default DustPage;
>>>>>>> f6330e6e1a2ca254b6b87a7a668c8db2cbcf7a64
