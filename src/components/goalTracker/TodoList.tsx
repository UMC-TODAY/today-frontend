import { useGetSchedule } from "../../hooks/queries/useSchedule.ts";

export default function TodoList() {
  // TODO : 월별 일정 조회 api 연결 시 수정
  const { data: response } = useGetSchedule({
    is_done: undefined,
    category: "",
    schedule_date: "",
    keyword: "",
  } as any);

  const todoList = response?.data || [];

  return (
    <div>
      {todoList.length === 0 ? <div>데이터가 0개입니다</div> : null}

      <button>지난 일정 숨기기</button>

      {todoList.map((todo) => (
        <div
          key={todo.id}
          style={{ border: "1px solid #ddd", margin: "5px", padding: "5px" }}
        >
          {todo.schedule_date} / {todo.title}
        </div>
      ))}
    </div>
  );
}
