import { useState } from "react";
import { Plus, Calendar, Clock, Repeat } from "lucide-react";
import todosData from "../../data/todos.json";
import { CategoryIcon } from "./CategoryIcon";
import { categoryColors, itemEmojis, getTodayDate, getRepeatLabel } from "./constants";
import type { TodoItem, Category } from "./types";

interface TodoFinderProps {
  onOpenModal: (todo: TodoItem) => void;
}

export function TodoFinder({ onOpenModal }: TodoFinderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openTodoId, setOpenTodoId] = useState<string | null>(null);

  const categories = todosData.categories as Category[];

  // 키워드 버튼 클릭 핸들러
  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(selectedCategory === categoryKey ? null : categoryKey);
  };

  // 할일 아이템 클릭 핸들러
  const handleTodoClick = (taskId: string) => {
    setOpenTodoId(openTodoId === taskId ? null : taskId);
  };

  // 카테고리 정렬 로직
  const sortedCategories = selectedCategory
    ? [
        categories.find(cat => cat.categoryKey === selectedCategory)!,
        ...categories.filter(cat => cat.categoryKey !== selectedCategory)
      ]
    : categories;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 overflow-y-auto scrollbar-hide flex-1 min-w-0">
      {/* Header */}
      <h1 className="text-left mb-4 text-[#0F1724]" style={{ fontFamily: 'Pretendard', fontSize: '24px', fontWeight: 500, lineHeight: '100%', letterSpacing: '0%' }}>
        할일 찾기
      </h1>

      {/* Filter Buttons - 2x4 그리드 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.slice(0, 8).map((category) => (
          <button
            key={category.categoryKey}
            onClick={() => handleCategoryClick(category.categoryKey)}
            className={`
              flex items-center justify-center gap-1
              text-[12px] font-medium
              transition
              shadow-[0_0_1px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.12)]
              ${selectedCategory === category.categoryKey
                ? "bg-blue-100 text-blue-700"
                : "bg-white text-[#0F1724]"
              }
            `}
            style={{ fontFamily: "Pretendard", width: '75px', height: '25px', borderRadius: '12px' }}
          >
            <CategoryIcon category={category.categoryKey} />
            <span className="leading-none">{category.categoryKey}</span>
          </button>
        ))}
      </div>

      {/* Category Sections */}
      {sortedCategories.map((category, categoryIndex) => (
        <div key={category.categoryKey} className={categoryIndex > 0 ? "mt-6" : ""}>
          {/* 카테고리 키워드 - 왼쪽 상단 */}
          <h2
            className="text-base font-semibold text-left mb-3 text-[#0F1724]"
            style={{ fontFamily: 'Pretendard' }}
          >
            {category.categoryKey}
          </h2>

          <div className="space-y-2">
            {category.items.map((todo, index) => {
              const isOpen = openTodoId === todo.taskId;
              const colors = categoryColors[category.categoryKey] || categoryColors["관리"];
              const emojis = itemEmojis[category.categoryKey] || itemEmojis["관리"];
              const color = colors[index % colors.length];
              const emoji = emojis[index % emojis.length];

              return (
                <div
                  key={todo.taskId}
                  className={`transition overflow-hidden ${isOpen ? "" : ""}`}
                  style={{
                    minHeight: isOpen ? 'auto' : '48px',
                    borderRadius: '12px',
                    backgroundColor: isOpen ? '#EDF3FD' : '#FFFFFF',
                    boxShadow: '0 0 1px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {/* Todo Header */}
                  <div
                    className="flex items-center justify-between px-4 cursor-pointer"
                    style={{ height: '48px' }}
                    onClick={() => handleTodoClick(todo.taskId)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-sm flex-shrink-0`}
                      >
                        {emoji}
                      </div>
                      <p
                        style={{
                          color: '#0F1724',
                          fontFamily: 'Pretendard',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: 'normal',
                          textAlign: 'left'
                        }}
                      >
                        {todo.title}
                      </p>
                    </div>
                    {isOpen ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenModal(todo); }}
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-1.5 bg-white"
                        style={{ fontFamily: 'Pretendard' }}
                      >
                        <Plus className="w-4 h-4" />
                        내 할일에 추가하기
                      </button>
                    ) : (
                      <span
                        className="text-blue-500 flex-shrink-0"
                        style={{ fontFamily: 'Pretendard', fontSize: '10px', fontWeight: 400 }}
                      >
                        {(todo as any).usageCount ? `${(todo as any).usageCount.toLocaleString()}명이 활용했어요.` : `${Math.floor(Math.random() * 3000) + 500}명이 활용했어요.`}
                      </span>
                    )}
                  </div>

                  {/* Todo Detail - 토글로 표시 */}
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <div className="rounded-xl p-5" style={{ backgroundColor: '#F6F9FE' }}>
                        <div className="flex gap-6">
                          {/* 왼쪽: 하위작업 */}
                          <div className="flex-1">
                            <p
                              className="text-sm font-semibold text-[#0F1724] mb-3 text-left"
                              style={{ fontFamily: 'Pretendard' }}
                            >
                              하위 작업
                            </p>
                            {todo.subTasks && todo.subTasks.length > 0 && (
                              <div className="space-y-2">
                                {todo.subTasks.map((subTask, subIndex) => (
                                  <div
                                    key={subIndex}
                                    className="flex gap-3 items-start bg-white rounded-lg px-4 py-3"
                                  >
                                    <div className={`w-6 h-6 ${color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs`}>
                                      {emoji}
                                    </div>
                                    <p
                                      className="text-[#0F1724] flex-1 text-left"
                                      style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                                    >
                                      {subTask}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 오른쪽: 키워드, 설명, 날짜, 소요시간, 반복 */}
                          <div className="w-72 bg-white rounded-xl p-5 border border-gray-100">
                            {/* 상단: 키워드 + 드롭다운 */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                                <CategoryIcon category={category.categoryKey} />
                                <span
                                  className="text-[#0F1724] font-medium"
                                  style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                                >
                                  {category.categoryKey}
                                </span>
                              </div>
                              <select
                                className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                                style={{ fontFamily: 'Pretendard' }}
                              >
                                <option>사용자 지정</option>
                              </select>
                            </div>

                            {/* 키워드 설명 */}
                            <p
                              className="text-gray-600 text-sm mb-5 leading-relaxed"
                              style={{ fontFamily: 'Pretendard' }}
                            >
                              {todo.description}
                            </p>

                            {/* 날짜, 소요시간, 반복 */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-gray-500 text-sm"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  날짜
                                </span>
                                <div className="flex items-center gap-1.5 text-[#0F1724]">
                                  <Calendar className="w-4 h-4" />
                                  <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                    {getTodayDate()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span
                                  className="text-gray-500 text-sm"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  소요 시간
                                </span>
                                <div className="flex items-center gap-1.5 text-[#0F1724]">
                                  <Clock className="w-4 h-4" />
                                  <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                    {todo.defaultDurationMin}분
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span
                                  className="text-gray-500 text-sm"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  반복
                                </span>
                                <div className="flex items-center gap-1.5 text-[#0F1724]">
                                  <Repeat className="w-4 h-4" />
                                  <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                    {getRepeatLabel(todo.repeatRule)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
