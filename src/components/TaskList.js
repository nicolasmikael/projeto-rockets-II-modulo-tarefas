import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import TaskFilters from "./TaskFilters";
import CreateTaskForm from "./CreateTaskForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ClayButton from "@clayui/button";
import { API_URL } from "../services/taskService";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { v4 as uuidv4 } from "uuid";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const convertToISO = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

const TaskList = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });
  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
    priority: "all",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "Baixa",
    status: "pending",
  });
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        if (isMounted.current) {
          const groupedTasks = {
            pending: [],
            in_progress: [],
            completed: [],
          };
          response.data.forEach((task) => {
            groupedTasks[task.status].push(task);
          });
          setTasks(groupedTasks);
          console.log("Tarefas carregadas:", groupedTasks);
        }
      } catch (error) {
        if (isMounted.current) {
          setError("Erro ao carregar tarefas");
          console.error(error);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleCreateTask = useCallback(async () => {
    try {
      const newTaskWithId = { ...newTask, id: uuidv4() };

      const idExists = tasks.pending
        .concat(tasks.in_progress, tasks.completed)
        .some((task) => task.id === newTaskWithId.id);
      if (idExists) {
        throw new Error("ID duplicado. Tente novamente.");
      }

      setTasks((prevTasks) => ({
        ...prevTasks,
        [newTask.status]: [...prevTasks[newTask.status], newTaskWithId],
      }));

      await axios.post(API_URL, newTaskWithId);
      console.log("Tarefa criada:", newTaskWithId);
      if (isMounted.current) {
        setIsCreatingTask(false);
        setNewTask({
          title: "",
          description: "",
          due_date: "",
          priority: "Baixa",
          status: "pending",
        });
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Erro ao criar tarefa: " + error.message);
        console.error(error);
      }
    }
  }, [newTask, tasks]);

  const handleDeleteTask = useCallback(async (taskId, status) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      if (isMounted.current) {
        setTasks((prevTasks) => ({
          ...prevTasks,
          [status]: prevTasks[status].filter((task) => task.id !== taskId),
        }));
        console.log(`Tarefa ${taskId} deletada da coluna ${status}`);
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Erro ao deletar tarefa");
        console.error(error);
      }
    }
  }, []);

  const handleUpdateTask = useCallback(
    async (taskId, updatedFields, destIndex = null) => {
      try {
        let taskToUpdate = null;
        let currentStatus = "";
        for (const status in tasks) {
          const foundTask = tasks[status].find((task) => task.id === taskId);
          if (foundTask) {
            taskToUpdate = foundTask;
            currentStatus = status;
            break;
          }
        }

        if (!taskToUpdate) {
          throw new Error("Tarefa não encontrada.");
        }

        const updatedTask = { ...taskToUpdate, ...updatedFields };

        setTasks((prevTasks) => {
          const newTasks = { ...prevTasks };

          newTasks[currentStatus] = newTasks[currentStatus].filter(
            (task) => task.id !== taskId
          );

          newTasks[updatedTask.status] = Array.from(
            newTasks[updatedTask.status]
          );
          if (destIndex !== null) {
            newTasks[updatedTask.status].splice(destIndex, 0, updatedTask);
          } else {
            newTasks[updatedTask.status].push(updatedTask);
          }

          return newTasks;
        });

        await axios.put(`${API_URL}/${taskId}`, updatedTask);
        console.log(`Tarefa ${taskId} atualizada com sucesso.`);
      } catch (error) {
        if (isMounted.current) {
          setError("Erro ao atualizar a tarefa: " + error.message);
          console.error(error);
        }
      }
    },
    [tasks]
  );

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }, []);

  const applyFilters = useCallback(() => {
    const { startDate, endDate } = filters;

    const filterByDateRange = (task) => {
      if (!startDate || !endDate) return true;

      const taskDueDate = task.due_date;
      const start = convertToISO(startDate);
      const end = convertToISO(endDate);

      return taskDueDate >= start && taskDueDate <= end;
    };

    const filterByPriority = (task) => {
      if (filters.priority === "all") return true;
      return task.priority === filters.priority;
    };

    if (filters.status !== "all") {
      return {
        [filters.status]: tasks[filters.status].filter(
          (task) => filterByDateRange(task) && filterByPriority(task)
        ),
      };
    } else {
      const filtered = {
        pending: tasks.pending.filter(
          (task) => filterByDateRange(task) && filterByPriority(task)
        ),
        in_progress: tasks.in_progress.filter(
          (task) => filterByDateRange(task) && filterByPriority(task)
        ),
        completed: tasks.completed.filter(
          (task) => filterByDateRange(task) && filterByPriority(task)
        ),
      };
      return filtered;
    }
  }, [filters, tasks]);

  const filteredTasks = useMemo(() => applyFilters(), [applyFilters]);

  const onDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const sourceStatus = source.droppableId;
      const destStatus = destination.droppableId;
      const destIndex = destination.index;

      if (sourceStatus === destStatus) {
        const reorderedTasks = reorder(
          tasks[sourceStatus],
          source.index,
          destination.index
        );

        setTasks((prevTasks) => ({
          ...prevTasks,
          [sourceStatus]: reorderedTasks,
        }));
      } else {
        await handleUpdateTask(draggableId, { status: destStatus }, destIndex);
      }
    },
    [handleUpdateTask, tasks]
  );

  const statusesToRender =
    filters.status === "all"
      ? ["pending", "in_progress", "completed"]
      : [filters.status];

  return (
    <div className="container my-4" style={{ maxWidth: "1200px" }}>
      <h2 className="text-center mb-4">Lista de Tarefas</h2>
      <div className="rounded shadow p-3">
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="row align-items-center mb-3 justify-content-center">
          <div className="col-12 col-md-8">
            <TaskFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-12 col-md-auto mt-3 mt-md-0">
            <ClayButton
              onClick={() => setIsCreatingTask(true)}
              displayType="primary"
              className="d-block d-md-inline-block w-100 w-md-auto"
            >
              Criar Nova Tarefa
              <span className="inline-item inline-item-after px-2">
                <FontAwesomeIcon icon={faFileCirclePlus} className="ms-2" />
              </span>
            </ClayButton>
          </div>
        </div>

        {isCreatingTask && (
          <CreateTaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            handleCreateTask={handleCreateTask}
            setIsCreatingTask={setIsCreatingTask}
          />
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="row">
            {statusesToRender.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={filteredTasks[status]}
                handleDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskList;
