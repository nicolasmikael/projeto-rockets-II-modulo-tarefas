import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ClayCard from "@clayui/card";
import ClayButton from "@clayui/button";
import ClayModal, { useModal } from "@clayui/modal";
import ClayForm, { ClayInput, ClaySelect } from "@clayui/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const TaskItem = React.memo(({ task, index, onDelete, onUpdateTask }) => {
  const [visible, setVisible] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newStatus, setNewStatus] = useState(task.status);

  const { observer, onClose } = useModal({
    onClose: () => setVisible(false),
  });

  const handleSaveTask = async () => {
    console.log(`Salvando alterações para tarefa ${task.id}`);

    if (typeof onUpdateTask === "function") {
      await onUpdateTask(task.id, {
        description: newDescription,
        status: newStatus,
      });
      setVisible(false);
    } else {
      console.error("onUpdateTask não está definido");
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
        >
          <ClayCard className="task-item">
            <ClayCard.Body>
              <ClayCard.Description tag="h6" className="mb-1">
                {task.title}
              </ClayCard.Description>
              <ClayCard.Description displayType="text" className="mb-2">
                {task.description}
              </ClayCard.Description>
              <div className="mb-2">
                <span className="font-weight-bold">Vencimento:</span>{" "}
                {formatDate(task.due_date)}
              </div>
              <div className="mb-2">
                <span className="font-weight-bold">Prioridade:</span>{" "}
                {task.priority}
              </div>
              <div className="d-flex justify-content-end">
                <ClayButton
                  className="mx-2"
                  onClick={() => setVisible(true)}
                  displayType="info"
                >
                  <FontAwesomeIcon icon={faEye} /> Visualizar
                </ClayButton>
                <ClayButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  displayType="danger"
                  className={"delete-button"}
                >
                  Deletar
                </ClayButton>
              </div>
            </ClayCard.Body>
          </ClayCard>

          {visible && (
            <ClayModal observer={observer} size="lg">
              <ClayModal.Body>
                <ClayForm>
                  <ClayForm.Group>
                    <label>Título</label>
                    <p>{task.title}</p>
                  </ClayForm.Group>
                  <ClayForm.Group>
                    <label>Data de Vencimento</label>
                    <p>{formatDate(task.due_date)}</p>
                  </ClayForm.Group>
                  <ClayForm.Group>
                    <label>Prioridade</label>
                    <p>{task.priority}</p>
                  </ClayForm.Group>
                  <ClayForm.Group>
                    <label htmlFor={`description-${task.id}`}>Descrição</label>
                    <ClayInput
                      component="textarea"
                      id={`description-${task.id}`}
                      name="description"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      required
                      rows={3}
                      className="form-control"
                    />
                  </ClayForm.Group>
                  <ClayForm.Group>
                    <label htmlFor={`status-${task.id}`}>Status</label>
                    <ClaySelect
                      id={`status-${task.id}`}
                      name="status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="form-control"
                    >
                      <ClaySelect.Option label="Pendente" value="pending" />
                      <ClaySelect.Option
                        label="Em Progresso"
                        value="in_progress"
                      />
                      <ClaySelect.Option label="Concluída" value="completed" />
                    </ClaySelect>
                  </ClayForm.Group>
                </ClayForm>
              </ClayModal.Body>
              <ClayModal.Footer
                first={
                  <ClayButton.Group spaced>
                    <ClayButton displayType="secondary" onClick={onClose}>
                      Cancelar
                    </ClayButton>
                  </ClayButton.Group>
                }
                last={
                  <ClayButton onClick={handleSaveTask} displayType="primary">
                    Salvar
                  </ClayButton>
                }
              />
            </ClayModal>
          )}
        </div>
      )}
    </Draggable>
  );
});

export default TaskItem;
