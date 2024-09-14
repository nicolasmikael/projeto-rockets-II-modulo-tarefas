import React, { useState, useEffect, useMemo } from "react";
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

// Função de reordenação
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const TaskList = () => {
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });
  const [filters, setFilters] = useState({
    status: "all",
    due_date: "",
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      // Organizar as tarefas por status
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
    } catch (error) {
      setError("Erro ao carregar tarefas");
      console.error(error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const newTaskWithId = { ...newTask, id: uuidv4() };

      const idExists = tasks.pending
        .concat(tasks.in_progress, tasks.completed)
        .some((task) => task.id === newTaskWithId.id);
      if (idExists) {
        throw new Error("ID duplicado. Tente novamente.");
      }

      const response = await axios.post(API_URL, newTaskWithId);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [newTask.status]: [...prevTasks[newTask.status], response.data],
      }));
      console.log("Tarefa criada:", response.data);
      setIsCreatingTask(false);
      setNewTask({
        title: "",
        description: "",
        due_date: "",
        priority: "Baixa",
        status: "pending",
      });
    } catch (error) {
      setError("Erro ao criar tarefa: " + error.message);
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId, status) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: prevTasks[status].filter((task) => task.id !== taskId),
      }));
      console.log(`Tarefa ${taskId} deletada da coluna ${status}`);
    } catch (error) {
      setError("Erro ao deletar tarefa");
      console.error(error);
    }
  };

  const handleUpdateTask = async (
    taskId,
    sourceStatus,
    destStatus,
    destIndex
  ) => {
    try {
      console.log(
        `Atualizando tarefa ${taskId} de ${sourceStatus} para ${destStatus} na posição ${destIndex}`
      );

      const taskToUpdate = tasks[sourceStatus].find(
        (task) => task.id === taskId
      );
      if (!taskToUpdate) {
        throw new Error("Tarefa não encontrada.");
      }

      let updatedTask = { ...taskToUpdate };
      if (sourceStatus !== destStatus) {
        updatedTask.status = destStatus;
      }

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        newTasks[sourceStatus] = Array.from(newTasks[sourceStatus]).filter(
          (task) => task.id !== taskId
        );

        newTasks[destStatus] = Array.from(newTasks[destStatus]);
        newTasks[destStatus].splice(destIndex, 0, updatedTask);

        return newTasks;
      });

      await axios.put(`${API_URL}/${taskId}`, updatedTask);

      console.log(`Tarefas após atualização:`, tasks);
    } catch (error) {
      setError("Erro ao atualizar a tarefa: " + error.message);
      console.error(error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    if (filters.status !== "all") {
      return {
        [filters.status]: tasks[filters.status].filter((task) => {
          const dueDateMatch = filters.due_date
            ? task.due_date === filters.due_date
            : true;
          const priorityMatch =
            filters.priority !== "all"
              ? task.priority === filters.priority
              : true;
          return dueDateMatch && priorityMatch;
        }),
      };
    } else {
      const filtered = {
        pending: tasks.pending.filter((task) => {
          const dueDateMatch = filters.due_date
            ? task.due_date === filters.due_date
            : true;
          const priorityMatch =
            filters.priority !== "all"
              ? task.priority === filters.priority
              : true;
          return dueDateMatch && priorityMatch;
        }),
        in_progress: tasks.in_progress.filter((task) => {
          const dueDateMatch = filters.due_date
            ? task.due_date === filters.due_date
            : true;
          const priorityMatch =
            filters.priority !== "all"
              ? task.priority === filters.priority
              : true;
          return dueDateMatch && priorityMatch;
        }),
        completed: tasks.completed.filter((task) => {
          const dueDateMatch = filters.due_date
            ? task.due_date === filters.due_date
            : true;
          const priorityMatch =
            filters.priority !== "all"
              ? task.priority === filters.priority
              : true;
          return dueDateMatch && priorityMatch;
        }),
      };
      return filtered;
    }
  };

  const filteredTasks = useMemo(() => applyFilters(), [tasks, filters]);

  const onDragEnd = async (result) => {
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

      try {
      } catch (error) {
        setError("Erro ao reordenar a tarefa: " + error.message);
        console.error(error);
      }
    } else {
      await handleUpdateTask(draggableId, sourceStatus, destStatus, destIndex);
    }
  };

  const statusesToRender =
    filters.status === "all"
      ? ["pending", "in_progress", "completed"]
      : [filters.status];

  useEffect(() => {
    console.log("Estado atual das tarefas:", tasks);
  }, [tasks]);

  return (
    <div className="container my-4" style={{ maxWidth: "1200px" }}>
      <h2 className="text-center mb-4">Lista de Tarefas</h2>
      <div className="bg-light rounded shadow p-3">
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
              <FontAwesomeIcon icon={faFileCirclePlus} className="ms-2" />
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
                handleDeleteTask={(taskId) => handleDeleteTask(taskId, status)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskList;
