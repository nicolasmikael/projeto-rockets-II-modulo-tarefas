import React from "react";
import ClayForm, { ClaySelect } from "@clayui/form";
import ClayDatePicker from "@clayui/date-picker";

const spritemap = require("@clayui/css/lib/images/icons/icons.svg").default;

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleDateChange = (value) => {
    console.log("Valor do DatePicker:", value);

    if (value) {
      const [startDate, endDate] = value.split(" - ");
      console.log("Data inicial:", startDate);
      console.log("Data final:", endDate);

      onFilterChange("startDate", startDate);
      onFilterChange("endDate", endDate);
    } else {
      onFilterChange("startDate", "");
      onFilterChange("endDate", "");
    }
  };

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
          <label htmlFor="filterDateRange">Período de Data</label>
          <ClayDatePicker
            placeholder="Selecionar período"
            onChange={handleDateChange}
            years={{
              start: 2024,
              end: new Date().getFullYear() + 20,
            }}
            range
            spritemap={spritemap}
            dateFormat="dd/MM/yyyy"
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
