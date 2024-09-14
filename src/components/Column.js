import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";

const Column = React.memo(({ status, tasks, handleDeleteTask }) => {
  const statusTitles = {
    pending: "Pendentes",
    in_progress: "Em Progresso",
    completed: "Concluídas",
  };

  return (
    <div className="col-12 col-md-4 mb-4">
      <h5 className="text-center mb-3">{statusTitles[status]}</h5>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-white rounded p-2 shadow-sm"
            style={{
              minHeight: "300px",
              transition: "none",
            }}
          >
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                onDelete={() => handleDeleteTask(task.id, status)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

export default Column;
