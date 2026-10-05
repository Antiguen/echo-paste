import { useState, useEffect } from 'react';

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
    const [history, setHistory] = useState([]);

    async function loadHistory() {
    const data = await window.echoPaste.getHistory();
    setHistory(data);
    }

    useEffect(() => {
        loadHistory();
        window.echoPaste.onHistoryUpdated(() => loadHistory());
    }, []);

    function handleCopy(id) {
    window.echoPaste.copyItem(id);
    }

    function handleDelete(id, e) {
    e.stopPropagation();
    window.echoPaste.deleteItem(id);
    }

    function handleClear() {
    window.echoPaste.clearHistory();
    }

    return (
    <div>
        <header>
        <h1>Echo Paste</h1>
        <button onClick={handleClear}>Clear All</button>
        </header>
        <div id="list">
        {history.length === 0 ? (
            <div id="empty">Nothing copied yet. Copy some text to get started!</div>
        ) : (
            history.map((entry) => (
            <div className="item" key={entry.id} onClick={() => handleCopy(entry.id)}>
                <button className="delete-btn" onClick={(e) => handleDelete(entry.id, e)}>✕</button>
                <div className="item-text">{entry.text}</div>
                <div className="item-time">{formatTime(entry.timestamp)}</div>
            </div>
            ))
        )}
        </div>
    </div>
);
}