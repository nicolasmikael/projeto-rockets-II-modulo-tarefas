import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ComponentBar from "./ComponentBar";
import DashboardGrid from "./DashboardGrid";
import { v4 as uuidv4 } from "uuid";

const initialComponents = [
  { id: "task-module", content: "Task Module" },
  { id: "quote-module", content: "Quote Module" },
];

const totalGridSpaces = 9;
const initialGridSpaces = Array.from({ length: totalGridSpaces }, () => ({
  id: uuidv4(),
  module: null,
}));

function Dashboard() {
  const [components, setComponents] = useState(initialComponents);
  const [gridModules, setGridModules] = useState(initialGridSpaces);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    if (
      source.droppableId === "component-bar" &&
      destination.droppableId.startsWith("grid-")
    ) {
      const draggedModule = components[source.index];
      const newGridModules = gridModules.map((space) => {
        if (space.id === destination.droppableId.split("grid-")[1]) {
          return { ...space, module: draggedModule };
        }
        return space;
      });

      setComponents((prev) =>
        prev.filter((_, index) => index !== source.index)
      );
      setGridModules(newGridModules);
    } else if (
      source.droppableId.startsWith("grid-") &&
      destination.droppableId === "component-bar"
    ) {
      const draggedModule = gridModules.find(
        (space) => space.id === source.droppableId.split("grid-")[1]
      ).module;
      const newGridModules = gridModules.map((space) => {
        if (space.id === source.droppableId.split("grid-")[1]) {
          return { ...space, module: null };
        }
        return space;
      });

      setGridModules(newGridModules);
      setComponents((prev) => [...prev, draggedModule]);
    } else if (
      source.droppableId.startsWith("grid-") &&
      destination.droppableId.startsWith("grid-")
    ) {
      const newGridModules = gridModules.map((space) => {
        if (space.id === source.droppableId.split("grid-")[1]) {
          return { ...space, module: null };
        }
        if (space.id === destination.droppableId.split("grid-")[1]) {
          return {
            ...space,
            module: gridModules.find(
              (space) => space.id === source.droppableId.split("grid-")[1]
            ).module,
          };
        }
        return space;
      });

      setGridModules(newGridModules);
    }
  };

  return (
    <div className="container mt-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <ComponentBar components={components} />
        <DashboardGrid gridModules={gridModules} />
      </DragDropContext>
    </div>
  );
}

export default Dashboard;
