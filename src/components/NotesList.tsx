import React, { useState, useEffect } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Note } from "../types";
import { useLocation, useNavigate } from "react-router";
import { getNotes } from "../apis/api";

interface NotesListProps {
  title: string;
  initialNotes: Note[]; // notes the yahan sirf
}

const NotesList: React.FC<NotesListProps> = ({ title, initialNotes }) => {
  // notes tha initialnotes ki jgah
  const { setSelectedNote, selectedNote, selectedFolder } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  // const folderId =

  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const loadMoreNotes = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;

      const isTrashView = location.pathname.includes("/trash");
      const isArchivedView = location.pathname.includes("/archived");
      const isFavoriteView = location.pathname.includes("/favorites");

      const newNotes = await getNotes(
        nextPage,
        limit,
        selectedFolder!,
        isTrashView ? true : undefined,
        isArchivedView ? true : undefined,
        isFavoriteView ? true : undefined
      );

      if (newNotes.length === 0) {
        setHasMore(false);
      } else {
        setNotes((prevNotes) => [...prevNotes, ...newNotes]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNotes(initialNotes);
    setPage(1);
    setHasMore(true);
  }, [initialNotes]);

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
          {hasMore && notes.length >= limit && (
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
};

export default NotesList;
