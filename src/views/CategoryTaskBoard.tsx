import TaskBoard from '../components/TaskBoard';
import React, { useMemo } from 'react';
import { inject, observer } from 'mobx-react';
import { useFetchTasksByCategory } from '../hooks/taskHooks';
import { CategoryTaskInput } from '../components/TaskInput';
import { Category } from 'src/types';

const inputVisibleType = ['inbox', 'today', 'tomorrow', 'next', 'someday', 'note'];

interface ICategoryTaskBoard {
  type: string;
  userId: string;
}

const BaseCategoryTaskBoard = ({ type, userId }: ICategoryTaskBoard) => {
  const isTaskInputVisible = useMemo(() => {
    return inputVisibleType.includes(type);
  }, [type]);

  const { items, isFetching } = useFetchTasksByCategory(type, 'page=1&limit=100');

  return (
    <TaskBoard
      type={type}
      isLoading={isFetching}
      items={items}
      TaskInput={
        isTaskInputVisible && <CategoryTaskInput category={type as Category} userId={userId} />
      }
    />
  );
};

export default inject('userStore')(
  observer(({ userStore, match }) => {
    return <BaseCategoryTaskBoard type={match.params.type} userId={userStore.userId} />;
  })
);
