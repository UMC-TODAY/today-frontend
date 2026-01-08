export default function CalendarPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>캘린더</h1>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div style={{
        display: 'flex',
        gap: '20px',
        flex: 1,
        minHeight: 0
      }}>
        {/* 왼쪽: 캘린더 영역 */}
        <div style={{
          flex: 2,
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '18px' }}>캘린더 영역</p>
        </div>

        {/* 오른쪽: 사이드 패널 */}
        <div style={{
          width: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* 이번달 달성 현황 */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: '#9ca3af' }}>이번달 달성 현황</p>
          </div>

          {/* 일정 리스트 */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0
          }}>
            <p style={{ color: '#9ca3af' }}>일정 리스트</p>
          </div>
        </div>
      </div>
    </div>
  );
}
