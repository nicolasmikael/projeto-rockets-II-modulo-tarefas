import React from "react";
import ClayButton from "@clayui/button";
import ClayForm, { ClayInput, ClaySelect } from "@clayui/form";

const CreateTaskForm = ({
  newTask,
  setNewTask,
  handleCreateTask,
  setIsCreatingTask,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  return (
    <ClayForm.Group className="p-3 border rounded mb-3">
      <h5 className="text-center mb-3">Criar Nova Tarefa</h5>
      <div className="row">
        <div className="col-12 mb-2">
          <label htmlFor="title">Título</label>
          <ClayInput
            id="title"
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            required={true}
            placeholder="Título da tarefa"
            className="form-control"
          />
        </div>

        <div className="col-12 mb-2">
          <label htmlFor="description">Descrição</label>
          <ClayInput
            id="description"
            component="textarea"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            required={true}
            placeholder="Descrição da tarefa"
            rows={2}
            className="form-control"
          />
        </div>

        <div className="col-6 mb-2">
          <label htmlFor="due_date">Data de Vencimento</label>
          <ClayInput
            id="due_date"
            type="date"
            name="due_date"
            value={newTask.due_date}
            onChange={handleInputChange}
            required={true}
            className="form-control"
          />
        </div>

        <div className="col-6 mb-2">
          <label htmlFor="priority">Prioridade</label>
          <ClaySelect
            id="priority"
            name="priority"
            value={newTask.priority}
            onChange={handleInputChange}
            className="form-control"
          >
            <ClaySelect.Option label="Baixa" value="Baixa" />
            <ClaySelect.Option label="Média" value="Média" />
            <ClaySelect.Option label="Alta" value="Alta" />
          </ClaySelect>
        </div>

        <div className="col-12 mb-2">
          <label htmlFor="status">Status</label>
          <ClaySelect
            id="status"
            name="status"
            value={newTask.status}
            onChange={handleInputChange}
            className="form-control"
          >
            <ClaySelect.Option label="Pendente" value="pending" />
            <ClaySelect.Option label="Em Progresso" value="in_progress" />
            <ClaySelect.Option label="Concluída" value="completed" />
          </ClaySelect>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <ClayButton
          onClick={handleCreateTask}
          displayType="primary"
          className="me-2"
        >
          Salvar
        </ClayButton>
        <ClayButton
          onClick={() => setIsCreatingTask(false)}
          displayType="secondary"
        >
          Cancelar
        </ClayButton>
      </div>
    </ClayForm.Group>
  );
};

export default CreateTaskForm;
