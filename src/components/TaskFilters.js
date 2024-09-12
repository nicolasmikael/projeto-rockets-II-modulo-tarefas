import React from "react";

const TaskFilter = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div>
      <div>
        <label>Filtrar por Status: </label>
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendentes</option>
          <option value="in_progress">Em Progresso</option>
          <option value="completed">Concluídas</option>
        </select>
      </div>

      <div>
        <label>Filtrar por Data de Vencimento: </label>
        <input
          type="date"
          name="due_date"
          value={filters.due_date}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label>Filtrar por Prioridade: </label>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleInputChange}
        >
          <option value="all">Todas</option>
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilter;
