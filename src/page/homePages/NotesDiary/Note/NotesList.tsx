import React, {useEffect, useState} from 'react';
import styles from '@/page/homePages/NotesDiary/Note/NotesList.module.scss';
import SimpleLayout from '@/page/homePages/MainPage/SimpleLayout.tsx';
import {transformNote} from "@/utils/transform.ts";
import {fetchPublicNote} from "@/services/noteService.ts";
import type {Note} from "@/type/publicType";

const NotesList: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchPublicNote();
            const transformed = response.map(transformNote);
            setNotes(transformed);
            if (transformed.length > 0) {
                setSelectedNote(transformed[0]);
            }
        } catch (err) {
            console.error('获取笔记列表失败:', err);
            setError('加载笔记失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    if (loading) {
        return (
            <section className={styles.notesSection}>
                <><SimpleLayout/></>
                <div className="container">
                    <div className={styles.loading}>加载中...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.notesSection}>
                <SimpleLayout />
                <div className="container">
                    <div className={styles.error}>{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.notesSection}>
            <SimpleLayout />
            <div className="container">
                <div className={styles.notesContainer}>
                    {/* 左侧卡片列表 */}
                    <div className={styles.notesSidebar}>
                        <h2 className={styles.sidebarTitle}>随记</h2>
                        <div className={styles.notesList}>
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    className={`${styles.noteCard} ${
                                        selectedNote?.id === note.id ? styles.active : ''
                                    }`}
                                    onClick={() => setSelectedNote(note)}
                                >
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardDate}>{note.dateTime.split(' ')[0]}</span>
                                        <span className={styles.cardTime}>{note.dateTime.split(' ')[1]}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{note.title}</h3>
                                    <p className={styles.cardSummary}>{note.summary}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 右侧详情区域 */}
                    <div className={styles.notesDetail}>
                        {selectedNote ? (
                            <>
                                <div className={styles.detailHeader}>
                                    <div className={styles.detailDateTime}>{selectedNote.dateTime}</div>
                                    <h2 className={styles.detailTitle}>{selectedNote.title}</h2>
                                </div>
                                <div className={styles.detailContent}>
                                    {selectedNote.content.split('\n').map((para, idx) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.empty}>暂无笔记内容</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotesList;