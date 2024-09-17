import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

function ComponentBar({ components }) {
  return (
    <Droppable droppableId="component-bar" direction="horizontal">
      {(provided, snapshot) => (
        <div
          className="component-bar"
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            display: "flex",
            padding: "5px",
            backgroundColor: snapshot.isDraggingOver ? "#cceeff" : "#f8f9fa",
            borderBottom: "1px solid #ddd",
            minHeight: "40px",
            maxHeight: "70px",
            alignItems: "center",
            justifyContent: components.length === 0 ? "center" : "flex-start",
            transition: "background-color 0.2s ease",
            position: "relative",
            borderRadius: "8px",
          }}
        >
          {components.map((component, index) => (
            <Draggable
              key={component.id}
              draggableId={component.id}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    display: "inline-block",
                    padding: "8px",
                    marginRight: "5px",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    ...provided.draggableProps.style,
                    width: "auto",
                    height: "auto",
                  }}
                >
                  {component.content}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default ComponentBar;
