export type Task = {
  id: number;
  name: string;
  deadline: string;
  filePath: string;
  courseId: number;
};

export type TaskRequest = {
  name: string;
  deadline: string;
  file: File;
};
