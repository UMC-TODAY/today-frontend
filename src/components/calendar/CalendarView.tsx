import { useState } from "react";
import TodoModal from "../goalTracker/TodoModal.tsx";

export default function CalendarView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      <button onClick={toggleModal}>+ 일정 등록하기</button>

      {isModalOpen && <TodoModal onClose={toggleModal} />}
    </div>
  );
}
