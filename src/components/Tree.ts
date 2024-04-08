import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Folder {
  id: string;
  name: string;
  children: Array<File>;
}

interface File {
  id: string;
  name: string;
}

const initialFolders: Folder[] = [
  {
    id: "folder1",
    name: "Folder 1",
    children: [
      { id: "file1", name: "File 1" },
      { id: "file2", name: "File 2" },
    ],
  },
  {
    id: "folder2",
    name: "Folder 2",
    children: [],
  },
];

const Tree: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const folderIndex = folders.findIndex(
        (folder) => folder.id === source.droppableId
      );
      const newChildren = [...folders[folderIndex].children];
      const [removed] = newChildren.splice(source.index, 1);
      newChildren.splice(destination.index, 0, removed);

      const newFolders = [...folders];
      newFolders[folderIndex] = {
        ...newFolders[folderIndex],
        children: newChildren,
      };

      setFolders(newFolders);
    } else {
      const sourceFolderIndex = folders.findIndex(
        (folder) => folder.id === source.droppableId
      );
      const destinationFolderIndex = folders.findIndex(
        (folder) => folder.id === destination.droppableId
      );

      const sourceFolder = folders[sourceFolderIndex];
      const destinationFolder = folders[destinationFolderIndex];

      const sourceChildren = [...sourceFolder.children];
      const destinationChildren = [...destinationFolder.children];

      const [removed] = sourceChildren.splice(source.index, 1);
      destinationChildren.splice(destination.index, 0, removed);

      const newFolders = [...folders];
      newFolders[sourceFolderIndex] = {
        ...sourceFolder,
        children: sourceChildren,
      };
      newFolders[destinationFolderIndex] = {
        ...destinationFolder,
        children: destinationChildren,
      };

      setFolders(newFolders);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {folders.map((folder) => (
        <div key={folder.id}>
          <h3>{folder.name}</h3>
          <Droppable droppableId={folder.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {folder.children.map((child, index) => (
                  <Draggable
                    key={child.id}
                    draggableId={child.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {child.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </DragDropContext>
  );
};

export default Tree;
