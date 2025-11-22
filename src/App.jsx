import { useEffect, useState } from 'react';
import './App.css';

const TaskCounter = ({ taskList }) => {
  return (
    <span>
      {taskList.length === 0
        ? 'Well done! No task left'
        : `${taskList.length} Task Left`}
    </span>
  );
};


const AddTask = ({ taskList, setTaskList, myTodoUrl }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {

      const newTask = { 
        label: inputValue.trim(), 
        is_done: false 
      };

      const resp = await fetch(myTodoUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (resp.ok) {
        const createdTask = await resp.json();
        setTaskList([...taskList, createdTask]);
      }

      setInputValue('');
    }
  };

  return (
    <input
      type="text"
      placeholder="ENTER your task here"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};


const HandleTask = ({ task, taskList, setTaskList, apiUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  const removeTask = async () => {
    const newList = taskList.filter((tarea) => tarea.id !== task.id);
    setTaskList(newList);

    await fetch(`${apiUrl}/${task.id}`, {
      method: 'DELETE',
    });
  };

  return (
    <li
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative'}}
    >
      {task.label} 
      {isHovered && (
        <button
          onClick={removeTask}
          style={{
            padding: '1px 8px',
            marginLeft: '10px',
            background: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ✔
        </button>
      )}
    </li>
  );
};

const ShowTask_List = ({ taskList, setTaskList, apiUrl }) => {
  return (
    <ul style={{ listStyle: 'none' }}>
      {taskList.map((task, index) => (
        <HandleTask
          key={task.id}
          task={task}
          index={index}
          taskList={taskList}
          setTaskList={setTaskList}
          apiUrl={apiUrl}
        />
      ))}
    </ul>
  );
};

function App() {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const myUserUrl = 'https://playground.4geeks.com/todo/users/JavierCS';
  const myTodoUrl = 'https://playground.4geeks.com/todo/todos/JavierCS';
  const apiUrl = 'https://playground.4geeks.com/todo/todos';

  useEffect(() => {
    async function initUserAndTasks() {
      setIsLoading(true);

      await fetch(myUserUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([]),
      });

      const resp = await fetch(myUserUrl);
      const data = await resp.json();
      setTaskList(data.todos || []);
      setIsLoading(false);
    }

    initUserAndTasks();
  }, []);

  return (
    <div>
      <h1>To Do List</h1>
      {isLoading && <h2>Loading...</h2>}

      <AddTask
        taskList={taskList}
        setTaskList={setTaskList}
        myTodoUrl={myTodoUrl}
      />

      <ShowTask_List
        taskList={taskList}
        setTaskList={setTaskList}
        apiUrl={apiUrl}
      />

      <TaskCounter taskList={taskList} />
    </div>
  );
}

export default App;
