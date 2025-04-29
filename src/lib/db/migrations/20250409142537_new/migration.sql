-- CreateTable
CREATE TABLE "Post" (
    "post_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacher_id" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "school_year" INTEGER,
    CONSTRAINT "Post_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chat" (
    "chat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender_id" TEXT NOT NULL,
    "reciever_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Chat_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Chat_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "Users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
