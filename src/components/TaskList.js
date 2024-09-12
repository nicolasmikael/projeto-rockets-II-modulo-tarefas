import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskFilter from "./TaskFilters";
import TaskItem from "./TaskItem";
import { API_URL } from "../services/taskService";
import { Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus, faPlus } from "@fortawesome/free-solid-svg-icons";
import "@clayui/css/lib/css/atlas.css";
import ClayButton from "@clayui/button";

const TaskList = () => {
  const [open, setOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
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
      setTasks(response.data);
    } catch (error) {
      setError("Erro ao carregar tarefas");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleCreateTask = async () => {
    try {
      await axios.post(API_URL, newTask);
      fetchTasks();
      setIsCreatingTask(false);
      setNewTask({
        title: "",
        description: "",
        due_date: "",
        priority: "Baixa",
        status: "pending",
      });
    } catch (error) {
      setError("Erro ao criar tarefa");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      setError("Erro ao deletar tarefa");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);

      const updatedTask = { ...taskToUpdate, status: newStatus };

      await axios.put(`${API_URL}/${taskId}`, updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (error) {
      setError("Erro ao atualizar status");
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = tasks;
    if (filters.status !== "all") {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    if (filters.due_date) {
      filtered = filtered.filter(
        (task) => new Date(task.due_date) >= new Date(filters.due_date)
      );
    }

    if (filters.priority !== "all") {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, tasks]);

  return (
    <div className="container-fluid">
      <h2>Lista de Tarefas</h2>
      <div>
        <ClayButton
          onClick={() => setOpen(!open)}
          aria-controls="collapse-element"
          aria-expanded={open}
        >
          <FontAwesomeIcon icon={faPlus} />
        </ClayButton>
        <Collapse in={open} timeout={200}>
          <div id="collapse-element">
            {error && <p>{error}</p>}
            <ClayButton onClick={() => setIsCreatingTask(true)}>
              {"Criar Nova Tarefa"}
              <span className="inline-item inline-item-after">
                <FontAwesomeIcon icon={faFileCirclePlus} />
              </span>
            </ClayButton>
            <TaskFilter filters={filters} onFilterChange={handleFilterChange} />
            {isCreatingTask && (
              <div>
                <h3>Criar Nova Tarefa</h3>
                <div>
                  <label>Título:</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Descrição:</label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Data de Vencimento:</label>
                  <input
                    type="date"
                    name="due_date"
                    value={newTask.due_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Prioridade:</label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
                <ClayButton
                  onClick={handleCreateTask}
                  className="btn btn-success"
                >
                  Salvar
                </ClayButton>
                <ClayButton
                  onClick={() => setIsCreatingTask(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </ClayButton>
              </div>
            )}
            <div className="autofit-row">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default TaskList;
