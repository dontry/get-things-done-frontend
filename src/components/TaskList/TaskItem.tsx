import React from 'react';
import { Checkbox } from 'antd';
import { TaskItemContainer, TitleWrapper, CloseButton } from './style';
import { ITask } from 'src/types';
import { Link } from 'react-router-dom';
import { useUpdateTask } from '../../hooks/taskHooks';

interface ITaskItemProps {
  type: string;
  task: ITask;
  isDragging?: boolean;
}

const TaskItem = React.memo(({ type, task, isDragging }: ITaskItemProps) => {
  if (!task.id) {
    return null;
  }
  const { updateTask } = useUpdateTask();

  return <TaskItemContainer isDragging={isDragging}>{_renderTask(task, type)}</TaskItemContainer>;

  function _renderTask(_task: ITask, _type: string) {
    switch (_type) {
      case 'deleted':
        return <DeletedTask task={_task} />;
      case 'completedAt':
        return <CompletedTask task={_task} handleCheck={_handleCheck} />;
      default:
        return <TodoTask task={_task} handleCheck={_handleCheck} handleDelete={_handleDelete} />;
    }
  }

  async function _handleCheck(_task: ITask) {
    if (_task.completedAt === 0) {
      _task.completedAt = Date.now();
    } else {
      _task.completedAt = 0;
    }
    if (_task.id) {
      updateTask({ task: _task });
    }
  }

  async function _handleDelete(_task: ITask) {
    _task.deleted = 1;
    if (_task.id) {
      updateTask({ task: _task });
    }
  }
});

interface ITaskProps {
  task: ITask;
  handleCheck?: (task: ITask) => void;
  handleDelete?: (task: ITask) => void;
}

const TodoTask = ({ task, handleCheck, handleDelete }: ITaskProps) => (
  <>
    <Checkbox onChange={() => handleCheck && handleCheck(task)} />
    <TitleWrapper>
      <TaskLink task={task} />
    </TitleWrapper>
    <CloseButton onClick={() => handleDelete && handleDelete(task)}>&times;</CloseButton>
  </>
);

const DeletedTask = ({ task }: ITaskProps) => (
  <TitleWrapper>
    <TaskLink task={task} />
  </TitleWrapper>
);

const CompletedTask = ({ task, handleCheck }: ITaskProps) => (
  <>
    <Checkbox checked={task.completedAt > 0} onChange={() => handleCheck && handleCheck(task)} />
    <TitleWrapper>
      <TaskLink task={task} />
    </TitleWrapper>
  </>
);

const TaskLink = ({ task }: { task: ITask }) => (
  <Link to={`/home/task/${task.id}`}>{task.title}</Link>
);

export default TaskItem;
