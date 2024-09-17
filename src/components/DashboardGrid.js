import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskModule from "./TaskModule/TaskList";
import QuoteData from "./QuoteModule/QuoteData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faUpDownLeftRight,
} from "@fortawesome/free-solid-svg-icons";

function DashboardGrid({ gridModules }) {
  const renderModuleContent = (module, isCollapsed) => {
    if (isCollapsed) return null;
    switch (module?.id) {
      case "task-module":
        return <TaskModule />;
      case "quote-module":
        return <QuoteData />;
      default:
        return <div>Conteúdo desconhecido</div>;
    }
  };

  const Module = ({ module, index }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };

    return (
      <Draggable key={module.id} draggableId={module.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mosaic-item ${
              snapshot.isDragging ? "is-dragging" : ""
            }`}
            style={{
              ...provided.draggableProps.style,
              width: snapshot.isDragging ? "150px" : "100%",
              height: snapshot.isDragging ? "80px" : "auto",
              padding: snapshot.isDragging ? "5px" : "10px",
              backgroundColor: snapshot.isDragging ? "#c1d5e8" : "#fff",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: snapshot.isDragging ? "#fff" : "#000",
              textAlign: "center",
              cursor: "grab",
              boxShadow: snapshot.isDragging
                ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                : "none",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              {...provided.dragHandleProps}
              className="drag-handle"
              style={{
                cursor: "grab",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <FontAwesomeIcon icon={faUpDownLeftRight} size="lg" />
              {!snapshot.isDragging && (
                <button
                  onClick={toggleCollapse}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon
                    icon={isCollapsed ? faChevronDown : faChevronUp}
                  />
                </button>
              )}
            </div>
            {!snapshot.isDragging && (
              <div style={{ marginTop: "10px", width: "100%" }}>
                {renderModuleContent(module, isCollapsed)}
              </div>
            )}
            {snapshot.isDragging && <span>{module.content}</span>}
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div
      className="mosaic-wrapper"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
        gridAutoRows: "minmax(150px, auto)",
        gridGap: "10px",
        padding: "10px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {gridModules.map((space, index) => (
        <Droppable
          key={space.id}
          droppableId={`grid-${space.id}`}
          direction="vertical"
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`drop-area ${
                snapshot.isDraggingOver ? "is-over" : ""
              }`}
              style={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                minHeight: "150px",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                transition: "border 0.2s ease",
              }}
            >
              {space.module ? (
                <Module module={space.module} index={index} />
              ) : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
}

export default DashboardGrid;
