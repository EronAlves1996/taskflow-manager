export const TaskStatus = ['pending', 'in-progress', 'completed'] as const;
export type TaskStatusEnum = (typeof TaskStatus)[number];

export const Priority = ['low', 'medium', 'high', 'urgent'] as const;
export type PriorityEnum = (typeof Priority)[number];
