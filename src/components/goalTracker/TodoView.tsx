import { useState } from "react";
import TodoModal from "./TodoModal.tsx";

export default function TodoView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      <button onClick={toggleModal}>+ 할 일 등록하기</button>

      {isModalOpen && <TodoModal onClose={toggleModal} />}
    </div>
  );
}
