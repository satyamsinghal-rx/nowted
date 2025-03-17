import { useEffect, useCallback, useMemo } from "react";
import NotesList from "../components/NotesList";
import { useAppContext } from "../hooks/useAppContext";
import { useParams } from "react-router";
import NoteEditor from "../components/NoteEditor";

function Home() {
  const {
    notes,
    notesByFolder,
    setSelectedNote,
    setSelectedFolder,
    archived,
    deleted,
    folders,
    favorites,
  } = useAppContext();
  const { folderId, noteId, view } = useParams();

  useEffect(() => {
    if (folderId) setSelectedFolder(folderId);
    else setSelectedFolder(null);

    if (noteId) {
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setSelectedNote(note);
      }
    }
  }, [folderId, noteId, notes, setSelectedFolder, setSelectedNote]);

  const getFilteredNotes = useCallback(() => {
    let filteredNotes = notes;

    if (view === "favorites") {
      filteredNotes = favorites.filter(
        (note) => note.isFavorite && !note.isDeleted
      );
    } else if (view === "trash") {
      filteredNotes = deleted.filter((note) => note.deletedAt != null);
    } else if (view === "archived") {
      filteredNotes = archived.filter(
        (note) => note.isArchived && note.deletedAt === null
      );
    } else if (folderId) {
      filteredNotes = notesByFolder;
    } else {
      filteredNotes = notes.filter(
        (note) =>
          note.folderId === folders[0].id && !note.isArchived && !note.isDeleted
      );
    }
    return filteredNotes;
  }, [
    view,
    notes,
    deleted,
    archived,
    folderId,
    notesByFolder,
    folders,
    favorites,
  ]);

  const filteredNotes = useMemo(() => getFilteredNotes(), [getFilteredNotes]);

  const getTitle = useCallback((): string => {
    if (view === "favorites") return "Favorites";
    if (view === "archived") return "Archived";
    if (view === "trash") return "Trash";
    if (folderId) {
      // const folderNotes = notes.find(note => note.folderId === folderId)
      // return folderNotes?.folder.name || 'Folder'
      const folder = folders.find((folder) => folder.id === folderId);
      return folder?.name || "Select A Folder";
    }
    if (folders.length > 0) {
      return folders[0].name;
    }
    return "No Folder";
  }, [view, folderId, folders]);

  const title = useMemo(() => getTitle(), [getTitle]);

  if (view === "new-note") {
    return (
      <div className="flex flex-1 h-full">
        <div className="w-80 h-screen overflow-hidden">
          <NotesList title={title} initialNotes={filteredNotes} />
        </div>
        <NoteEditor />
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full">
      <div className="w-80 h-screen overflow-hidden">
        <NotesList title={title} initialNotes={filteredNotes} />
      </div>
      <NoteEditor />
    </div>
  );
}

export default Home;
