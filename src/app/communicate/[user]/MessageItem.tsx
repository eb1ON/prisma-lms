"use client";
import { useState } from "react";

export default function MessageItem({
  chatId,
  message,
  time,
  isOwn,
}: {
  chatId: number;
  message: string;
  time: string;
  isOwn: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId }),
    });

    window.location.reload();
  };

  return (
    <div
      className={`m-4 mb-3 flex flex-col ${
        isOwn ? "items-end" : "items-start"
      }`}
    >
      <div className="relative group">
        <div
          className={`inline-block max-w-xs px-4 py-2 rounded-lg text-sm ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted text-muted-foreground rounded-bl-none"
          }`}
        >
          {message}
        </div>
        <span className="text-xs text-muted-foreground mt-1 block">{time}</span>

        {/* Зөвхөн өөрийн мессеж дээр устгах цэс харагдана */}
        {isOwn && (
          <div className="absolute top-0 right-[-25px]">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-muted-foreground hover:text-foreground text-lg px-2"
            >
              ...
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 bg-card border border-border shadow rounded z-10 w-28">
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="block w-full px-3 py-2 text-destructive hover:bg-muted text-sm"
                >
                  🗑️ Устгах
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Устгах баталгаажуулах UI */}
      {confirmDelete && (
        <div className="mt-2 bg-card border border-border rounded shadow p-3 text-sm flex items-center space-x-3">
          <span className="text-foreground">Устгах уу?</span>
          <button
            onClick={handleDelete}
            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Тийм
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="text-muted-foreground hover:text-foreground px-3 py-1 rounded"
          >
            Үгүй
          </button>
        </div>
      )}
    </div>
  );
}
