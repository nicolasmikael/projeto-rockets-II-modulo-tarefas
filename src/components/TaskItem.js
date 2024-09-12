import React from "react";
import ClayCard from "@clayui/card";
import ClayButton from "@clayui/button";
import ClayList from "@clayui/list";

const TaskItem = ({ task, onStatusChange, onDelete }) => {
  const handleStatusChange = (e) => {
    onStatusChange(task.id, e.target.value); // Chama a função de atualização de status
  };

  return (
    <>
      <ClayList className="autofit-col">
        <ClayCard className="m-2">
          <ClayCard.Body>
            <ClayCard.Description tag="h3">{task.title}</ClayCard.Description>
            <ClayCard.Description truncate={false} displayType="text">
              {task.description}
            </ClayCard.Description>
            <p>Vencimento: {new Date(task.due_date).toLocaleDateString()}</p>
            <p>Prioridade: {task.priority}</p>
            <div className="d-inline-flex">
              <label>Status:</label>
              <select value={task.status} onChange={handleStatusChange}>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluída</option>
              </select>
              <ClayButton
                onClick={() => onDelete(task.id)}
                className="btn btn-danger"
              >
                Deletar
              </ClayButton>
            </div>
          </ClayCard.Body>
        </ClayCard>
      </ClayList>

      {/* <li>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p>Vencimento: {new Date(task.due_date).toLocaleDateString()}</p>
        <p>Prioridade: {task.priority}</p>

        <label>Status:</label>
        <select value={task.status} onChange={handleStatusChange}>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Progresso</option>
          <option value="completed">Concluída</option>
        </select>

        <Button onClick={() => onDelete(task.id)} className="btn btn-danger">
          Deletar
        </Button>
      </li> */}
    </>
  );
};

export default TaskItem;
