import React, { useRef, RefObject } from 'react';
import { BehaviorSubject } from 'rxjs';
import TodoListItem from './todo-list-item';
import TodoListItemAdd from './todo-list-item-add';
import {
  addTodoAction,
  updateTodoAction,
  deleteTodoAction,
} from '../../data/get-todo-collection';

type PropTypes = {
  todoItemList: TodoItemType[];
  addTodoAction: typeof addTodoAction;
  updateTodoAction: typeof updateTodoAction;
  deleteTodoAction: typeof deleteTodoAction;
};

const TodoList: React.FC<PropTypes> = ({
  todoItemList = [],
  addTodoAction,
  updateTodoAction,
  deleteTodoAction,
}) => {
  const navSubject = useRef(
    new BehaviorSubject<ObservableNavigationInputType>({
      itemIndex: -1,
      cursor: undefined,
    })
  );

  const getNavigationObject = (index: number) => ({
    focusTo: (degree: number, cursor: any) => {
      const goToIndex = index + degree;
      navSubject.current.next({
        itemIndex: goToIndex > -1 ? goToIndex : 0,
        cursor,
      });
    },
    register: (ref: RefObject<HTMLInputElement>) =>
      navSubject.current.subscribe(({ itemIndex, cursor }) => {
        if (ref.current && itemIndex === index) {
          ref.current.focus();
          //  reset on focus to eliminate unwanted persistence
          navSubject.current.next({ itemIndex: -1, cursor: undefined });
        }
      }),
  });

  return (
    <>
      {todoItemList.map((listItem: TodoItemType, index: number) => (
        <TodoListItem
          key={listItem.id}
          todoItem={listItem}
          updateTodo={updateTodoAction}
          deleteTodo={deleteTodoAction}
          navigation={getNavigationObject(index)}
        />
      ))}
      <TodoListItemAdd
        addTodo={addTodoAction}
        navigation={getNavigationObject(todoItemList.length)}
      />
    </>
  );
};

export default TodoList;
