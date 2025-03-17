import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Note } from "../types";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

interface NotesListProps {
  title: string;
  initialNotes: Note[];
}

const NotesList: React.FC<NotesListProps> = React.memo(
  ({ title, initialNotes }) => {
    const { setSelectedNote, selectedNote } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialNotes.length === 10);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setNotes(initialNotes);
      setPage(1);
      setHasMore(initialNotes.length === 10);
    }, [initialNotes]);

    const handleNoteClick = (note: Note) => {
      setSelectedNote(note);

      if (location.pathname.includes("/folders/")) {
        navigate(`/folder/${note.folderId}/note/${note.id}`);
      } else if (location.pathname.includes("/favorites")) {
        navigate(`/favorites/notes/${note.id}`);
      } else if (location.pathname.includes("/archived")) {
        navigate(`/archived/notes/${note.id}`);
      } else if (location.pathname.includes("/trash")) {
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

    const loadMoreNotes = useCallback(async () => {
      setIsLoading(true);
      try {
        const folderId = location.pathname.includes("/folder/")
          ? location.pathname.split("/")[2]
          : undefined;

        const archived = location.pathname.includes("/archived") ? true : false;
        const deleted = location.pathname.includes("/trash") ? true : false;
        const favorite = location.pathname.includes("/favorites")
          ? true
          : false;

        const response = await axios.get<{ notes: Note[] }>(
          "https://nowted-server.remotestate.com/notes",
          {
            params: {
              page: page + 1,
              limit: 10,
              folderId,
              archived,
              deleted,
              favorite,
            },
          }
        );
        const newNotes = response.data.notes;
        setNotes((prevNotes) => [...prevNotes, ...newNotes]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(newNotes.length === 10);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, [page, location.pathname]);

    return (
      <div className="flex flex-col h-screen bg-secondary">
        <h2 className="text-xl font-semibold px-4 py-6">{title}</h2>

        {notes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>No notes found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 overflow-y-auto scrollbar-hide h-full px-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-4 w-full rounded h-auto bg-[#FFFFFF08] cursor-pointer hover:bg-[#FFFFFF1A] 
                        ${
                          selectedNote?.id === note.id ? "bg-[#FFFFFF1A]" : ""
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
            {hasMore && (
              <div className="py-6 flex justify-center">
                <button
                  onClick={loadMoreNotes}
                  disabled={isLoading}
                  className="w-32 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
export default NotesList;
