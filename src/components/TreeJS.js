import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Dữ liệu mẫu
const initialFolders = [
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

const TreeJS = () => {
    const [folders, setFolders] = useState(initialFolders);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            // Reorder within the same folder
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
            // Move from one folder to another
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
            {folders.map((folder: any) => (
                <div key={folder.id}>
                    <h3>{folder.name}</h3>
                    <Droppable Droppable={folders.id}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {folder.children.map((child, _index) => (
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
    )
};

export default TreeJS;
