import { useState } from "react";
import SettingModal from "../../components/setting/SettingModal";

export default function ModalTestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>설정 모달 테스트 페이지</h1>
      <button
        onClick={() => setIsOpen(true)}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        설정 모달 열기
      </button>

      <SettingModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  );
}
