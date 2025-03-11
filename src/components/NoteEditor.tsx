import { useCallback, useEffect } from 'react'
import { useAppContext } from '../hooks/useAppContext';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import calendarIcon from '../assets/calendar.svg'
import dropdownIcon from '../assets/dropdown.svg'
import { deleteNote } from '../apis/api';
import restoreIcon from '../assets/restore.svg'
import bigDocIcon from '../assets/bigDoc.svg'

function NoteEditor() {

    const {
        updateNote,
        folders,
        selectedNote,
        fetchNoteById,
        setSelectedNote,
        selectedFolder,
        restoreNote,
    } = useAppContext();

    const { noteId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);



    useEffect(() => {
        if (!noteId) return;

        const fetchNote = async () => {

            try {
                const noteData = await fetchNoteById(noteId);
                const note = noteData?.note || null;
                setSelectedNote(note);

                if (note) {
                    setTitle(note.title || '');
                    setContent(note.content || '');
                } else {
                    setTitle('');
                    setContent('');
                }
            } catch (error) {
                console.error('Error fetching note:', error);
                setSelectedNote(null);
                setTitle('');
                setContent('');
            }
        };

        fetchNote();
    }, [noteId, fetchNoteById, setSelectedNote]);

    const handleSave = useCallback(async () => {
        if (!selectedNote) return;

        await updateNote(selectedNote.id, { title, content });
        setIsEditing(false);
    }, [selectedNote, updateNote, setIsEditing, title, content])

    // const handleArchiveToggle = async () => {
    //     if (!selectedNote) return;
    //     await toggleArchive(selectedNote);
    //     setMenuOpen(false);
    //     console.log(selectedNote);


    //     if (!selectedNote.isArchived) {
    //         if (selectedFolder) {
    //             navigate(`/folder/${selectedFolder}/note/${selectedNote.id}`);
    //         } else {
    //             navigate('/');
    //         }
    //     }
    // };


    useEffect(() => {

        if (!selectedNote || !isEditing) return;

        const timer = setTimeout(() => {
            handleSave();
        }, 1000);

        return () => clearTimeout(timer)
    }, [title, content, selectedNote, isEditing, handleSave])

    const getCurrentFolder = () => {
        if (!selectedNote || !selectedNote.folderId) return 'No Folder';
        const folder = folders.find(fol => fol.id === selectedNote?.folderId);
        return folder ? folder.name : 'unknown folder';
    }


    if (!selectedNote || !location.pathname.includes('/note')) {
        return (
            <div className="h-screen w-4/5 bg-primary flex items-center justify-center">
                <div className='flex flex-col items-center gap-4'>
                    <img src={bigDocIcon} className='w-20 h-20' />
                    <p className='font-semibold text-3xl'>Select a note to view or edit</p>
                    <p className='text-center font-normal text-base'>Choose a note from the list on the left to view its contents, or create a
                        <br></br>new note to add to your collection.</p>
                </div>

            </div>
        );
    }

    if (selectedNote?.deletedAt != null) {
        return (
            <div className="h-screen w-4/5 bg-primary flex items-center justify-center ">
                <div className='flex flex-col items-center gap-4'>
                    <img src={restoreIcon} className='w-20 h-20' />
                    <p className='font-semibold text-3xl'>Restore '{selectedNote.title}'</p>
                    <p className='text-center font-normal text-base'>Don't want to lose this note? It's not too late! Just click the 'Restore'
                        <br></br>button and it will be added back to your list. It's that simple.</p>
                    <button
                        className="bg-tertiary text-white px-7 py-3 rounded-md text-sm"
                        onClick={() => { restoreNote(selectedNote.id) }}
                    >
                        Restore
                    </button>
                </div>

            </div>
        );
    }


    return (
        <div className="h-full w-4/5 bg-primary">
            <div className="flex justify-between items-center py-2 px-6 border-gray-700">
                <div className="flex-1 overflow-y-auto p-4">
                    <div className='flex justify-between'>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setIsEditing(true);
                            }}
                            placeholder="Note title"
                            className="w-full bg-transparent text-3xl font-bold mb-4 focus:outline-none border-b border-transparent focus:border-gray-600 pb-2"
                        />
                        <img src={dropdownIcon} className='cursor-pointer' onClick={() => setMenuOpen(!menuOpen)} />

                        {menuOpen && (
                            <div className="absolute right-10 top-20 w-48 bg-[#2c2c2c] rounded-md shadow-lg p-2">
                                <div className="flex items-center gap-3 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        if (selectedNote) {
                                            const updatedFavoriteStatus = !selectedNote.isFavorite;
                                            setSelectedNote({ ...selectedNote, isFavorite: updatedFavoriteStatus });
                                            updateNote(selectedNote.id, { isFavorite: updatedFavoriteStatus });
                                        }
                                        setMenuOpen(false);
                                    }}>

                                    <span>{selectedNote?.isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        if (selectedNote) {
                                            const updatedArchivedStatus = !selectedNote.isArchived;
                                            setSelectedNote({ ...selectedNote, isArchived: updatedArchivedStatus });
                                            updateNote(selectedNote.id, { isArchived: updatedArchivedStatus });
                                            navigate(`/folders/${selectedFolder}`);
                                            setSelectedNote(null);


                                        }
                                        setMenuOpen(false);
                                    }}
                                >
                                    <span>{selectedNote?.isArchived ? "Remove from Archived" : "Add to Archived"}</span>
                                </div>
                                <div className="border-t border-gray-600 my-1"></div>
                                <div className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                        if (selectedNote) {
                                            setSelectedNote({ ...selectedNote, deletedAt: String(Date.now()) });
                                            updateNote(selectedNote.id, { deletedAt: String(Date.now()) });
                                            deleteNote(selectedNote.id);
                                        }
                                        setMenuOpen(false);
                                    }}
                                >

                                    <span>Delete</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className='flex gap-6 py-1'>
                            <img src={calendarIcon} />
                            <p className='text-sm'>Date</p>
                            <span className='text-sm'>{new Date(selectedNote.updatedAt).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className='border-b border-gray-700 my-2'></div>
                        <div className='flex gap-6 py-1'>
                            <img src={calendarIcon} />
                            <p className='text-sm'>Folder</p>
                            <span className='text-sm'>{getCurrentFolder()}</span>
                        </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            setIsEditing(true);
                        }}
                        placeholder="Start writing your note here..."
                        className="w-full py-10 h-full min-h-[500px] bg-transparent focus:outline-none resize-none scrollbar-hide"
                    />
                </div>
            </div>
        </div>
    )
}

export default NoteEditor