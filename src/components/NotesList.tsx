import React from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Note } from "../types";
import { useLocation, useNavigate } from "react-router";

interface NotesListProps {
  title: string;
  notes: Note[];
}

const NotesList: React.FC<NotesListProps> = ({ title, notes }) => {
  const { setSelectedNote, selectedNote } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);

    if (location.pathname.includes("/folders/")) {
      navigate(`/folder/${note.folderId}/note/${note.id}`);
    } else if (location.pathname.includes("/favorites")) {
      // navigate(`/folder/${note.folderId}/note/${note.id}`);
      navigate(`/favorites/notes/${note.id}`);
    } else if (location.pathname.includes("/archived")) {
      // navigate(`/folder/${note.folderId}/note/${note.id}`);
      navigate(`/archived/notes/${note.id}`);
    } else if (location.pathname.includes("/trash")) {
      // navigate(`/folder/${note.folderId}/note/${note.id}`);
      navigate(`/trash/notes/${note.id}`);
    } else {
      navigate(`/folder/${note.folderId}/note/${note.id}`);
    }
  };

  const truncateContent = (content: string, maxLength = 20) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <h2 className="text-xl font-semibold px-4 py-6">{title}</h2>

      {notes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>No notes found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 overflow-y-auto scrollbar-hide max-h-[600px] px-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 w-full rounded h-auto bg-[#FFFFFF08] cursor-pointer hover:bg-[#FFFFFF1A] 
                                ${
                                  selectedNote?.id === note.id
                                    ? "bg-[#FFFFFF1A]"
                                    : ""
                                }`}
              onClick={() => handleNoteClick(note)}
            >
              <h3 className="font-medium text-lg">
                {note.title || "Untitled Note"}
              </h3>
              <div className="flex gap-4 py-2">
                <div className="text-sm text-gray-400">
                  {new Date(note.updatedAt).toLocaleDateString("en-GB")}
                </div>

                <p className="text-gray-300 text-sm">
                  {truncateContent(String(note.preview || ""))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
