import React from "react";
import ClayForm, { ClaySelect, ClayInput } from "@clayui/form";

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <ClayForm.Group>
      <div className="row">
        <div className="col-12 col-sm-4 mb-2">
          <label htmlFor="filterStatus">Status</label>
          <ClaySelect
            id="filterStatus"
            name="status"
            value={filters.status}
            onChange={handleInputChange}
            className="form-control"
          >
            <ClaySelect.Option label="Todas" value="all" />
            <ClaySelect.Option label="Pendentes" value="pending" />
            <ClaySelect.Option label="Em Progresso" value="in_progress" />
            <ClaySelect.Option label="Concluídas" value="completed" />
          </ClaySelect>
        </div>

        <div className="col-12 col-sm-4 mb-2">
          <label htmlFor="filterDueDate">Data de Vencimento</label>
          <ClayInput
            type="date"
            id="filterDueDate"
            name="due_date"
            value={filters.due_date}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="col-12 col-sm-4 mb-2">
          <label htmlFor="filterPriority">Prioridade</label>
          <ClaySelect
            id="filterPriority"
            name="priority"
            value={filters.priority}
            onChange={handleInputChange}
            className="form-control"
          >
            <ClaySelect.Option label="Todas" value="all" />
            <ClaySelect.Option label="Baixa" value="Baixa" />
            <ClaySelect.Option label="Média" value="Média" />
            <ClaySelect.Option label="Alta" value="Alta" />
          </ClaySelect>
        </div>
      </div>
    </ClayForm.Group>
  );
};

export default TaskFilters;
