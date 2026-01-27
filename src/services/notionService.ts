import { Client } from '@notionhq/client';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: import.meta.env.VITE_NOTION_API_KEY,
});

export interface NotionTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status?: string;
}

/**
 * Notion 데이터베이스에서 할일 목록을 가져옵니다
 * @param databaseId Notion 데이터베이스 ID
 */
export async function getNotionTasks(databaseId: string): Promise<NotionTask[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    return response.results.map((page: any) => {
      const properties = page.properties;

      return {
        id: page.id,
        title: properties.Name?.title?.[0]?.plain_text || '',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        dueDate: properties.Date?.date?.start || '',
        status: properties.Status?.select?.name || '',
      };
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
}

/**
 * Notion 데이터베이스에 새로운 할일을 추가합니다
 * @param databaseId Notion 데이터베이스 ID
 * @param task 추가할 할일 정보
 */
export async function addNotionTask(
  databaseId: string,
  task: {
    title: string;
    description?: string;
    dueDate?: string;
    status?: string;
  }
): Promise<void> {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: task.title,
              },
            },
          ],
        },
        ...(task.description && {
          Description: {
            rich_text: [
              {
                text: {
                  content: task.description,
                },
              },
            ],
          },
        }),
        ...(task.dueDate && {
          Date: {
            date: {
              start: task.dueDate,
            },
          },
        }),
        ...(task.status && {
          Status: {
            select: {
              name: task.status,
            },
          },
        }),
      },
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
}

/**
 * Notion 페이지를 업데이트합니다
 * @param pageId Notion 페이지 ID
 * @param updates 업데이트할 정보
 */
export async function updateNotionTask(
  pageId: string,
  updates: {
    title?: string;
    description?: string;
    status?: string;
  }
): Promise<void> {
  try {
    const properties: any = {};

    if (updates.title) {
      properties.Name = {
        title: [
          {
            text: {
              content: updates.title,
            },
          },
        ],
      };
    }

    if (updates.description) {
      properties.Description = {
        rich_text: [
          {
            text: {
              content: updates.description,
            },
          },
        ],
      };
    }

    if (updates.status) {
      properties.Status = {
        select: {
          name: updates.status,
        },
      };
    }

    await notion.pages.update({
      page_id: pageId,
      properties,
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
}

/**
 * Notion에서 할일을 삭제합니다 (아카이브)
 * @param pageId Notion 페이지 ID
 */
export async function deleteNotionTask(pageId: string): Promise<void> {
  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    throw error;
  }
}
