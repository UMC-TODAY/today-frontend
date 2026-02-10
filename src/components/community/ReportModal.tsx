import { X } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReportModal({ isOpen, onClose, onConfirm }: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold text-[#0F1724] mb-3" style={{ fontFamily: 'Pretendard' }}>
          신고가 정상적으로<br />접수되었습니다.
        </h3>
        <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Pretendard' }}>
          운영진이 빠르게 확인하여 조치를 취하도록 하겠습니다.<br />감사합니다.
        </p>
        <button
          onClick={onConfirm}
          className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"
          style={{ fontFamily: 'Pretendard' }}
        >
          확인하기
        </button>
      </div>
    </div>
  );
}
