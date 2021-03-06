import { useEffect, useMemo } from 'react';
import { queryCache, useMutation, usePaginatedQuery } from 'react-query';

import { apiService } from '../api';
import requestStore from '../stores/requestStore';
import taskStore from '../stores/taskStore';
import { INewTask, ITask } from '../types';

const initialFetchTasksData = {
  items: [],
  next: '',
  previous: '',
  pageCount: 0
};

export function useFetchTasksByCategory(
  category: string,
  paginationParams = 'page=1&limit=15'
) {
  const currentQueryKey = useMemo(() => ['tasks', category, paginationParams], [category, paginationParams]);
  const { status, error, resolvedData, isFetching } = usePaginatedQuery(
    ['tasks', category, paginationParams],
    (_, _category, _paginationParams) => apiService
      .get(`/tasks?category=${_category}&${_paginationParams}`)
      .then(res => res.data),
    {
      initialData: initialFetchTasksData,
      initialStale: () => !queryCache.getQueryData(['tasks', category, paginationParams])
    }
  );

  const { items, next, previous, pageCount } = resolvedData;
  useEffect(() => {
    if (status === 'success') {
      taskStore.addTaskList(items);
      requestStore.setCurrentQueryKey(currentQueryKey);
    }
  }, [status, items, currentQueryKey]);

  return { items, next, previous, pageCount, status, error, isFetching };
}

export function useFetchTasksByProjectId(
  projectId: string,
  paginationParams = 'page=1&limit=100'
) {
  const currentQueryKey = useMemo(() => ['project', projectId, paginationParams], [projectId, paginationParams]);
  const { status, error, isFetching, resolvedData } = usePaginatedQuery(
    ['project', projectId, paginationParams],
    (key, _projectId, _paginationParams) => apiService
      .get(`/tasks/${key}/${_projectId}?${_paginationParams}`)
      .then(res => res.data),
    {
      initialData: initialFetchTasksData,
      initialStale: () => !queryCache.getQueryData(projectId)
    }
  );

  const { items, next, previous, pageCount } = resolvedData || {
    items: [],
    next: '',
    previous: '',
    pageCount: 0
  };

  useEffect(() => {
    if (status === 'success') {
      taskStore.addTaskList(items);
      requestStore.setCurrentQueryKey(currentQueryKey);
    }
  }, [status, items, currentQueryKey]);

  return { items, next, previous, pageCount, status, error, isFetching };
}

export function useFetchTasksByContextId(
  contextId: string,
  paginationParams = 'page=1&limit=100'
) {
  const currentQueryKey = useMemo(() => ['context', contextId, paginationParams], [contextId, paginationParams]);
  const { status, error, isFetching, resolvedData } = usePaginatedQuery(
    ['context', contextId, paginationParams],
    (key, _contextId, _paginationParams) => apiService
      .get(`/tasks/${key}/${_contextId}?${_paginationParams}`)
      .then(res => res.data),
    {
      initialData: initialFetchTasksData,
      initialStale: () => !queryCache.getQueryData(contextId)
    }
  );

  const { items, next, previous, pageCount } = resolvedData || {
    items: [],
    next: '',
    previous: '',
    pageCount: 0
  };

  useEffect(() => {
    if (status === 'success') {
      taskStore.addTaskList(items);
      requestStore.setCurrentQueryKey(currentQueryKey);
    }
  }, [status, items, currentQueryKey]);

  return { items, next, previous, pageCount, status, error, isFetching };
}

interface IUpdateTaskMutationVariable {
  task: ITask;
}

export function useUpdateTask() {
  const [updateTask, { data, error, status }] = useMutation<ITask, IUpdateTaskMutationVariable>(
    ({ task }) => apiService.put(`/tasks/${task.id}`, task).then(res => res.data),
    {
      onSuccess: () => {
        queryCache.invalidateQueries(requestStore.currentQueryKey);
      }
    }
  );

  useEffect(() => {
    if (status === 'success') {
      const task = data as ITask;
      taskStore.updateTask(task);
    }
  }, [status, data]);

  return { updateTask, status, data, error };
}

interface ICreateTaskMutationVariable {
  task: INewTask;
}

export function useCreateTask() {
  const [createTask, { data, error, status }] = useMutation<ITask, ICreateTaskMutationVariable>(
    ({ task }) => apiService.post('/tasks', task).then(res => res.data),
    {
      onSuccess: () => queryCache.invalidateQueries(requestStore.currentQueryKey)
    }
  );

  useEffect(() => {
    if (status === 'success') {
      const task = data as ITask;
      taskStore.addTask(task);
    }
  }, [status, data]);

  return { createTask, status, data, error };
}

export function useDeleteTaskById(id: string) {
  const [createTask, { error, status }] = useMutation(() =>
    apiService.delete(`/tasks/${id}`).then(res => res.data)
  );

  useEffect(() => {
    if (status === 'success') {
      taskStore.deleteTaskById(id);
    }
  }, [status, id]);

  return { createTask, status, error };
}
