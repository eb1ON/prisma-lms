-- CreateTable
CREATE TABLE "Post" (
    "post_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacher_id" TEXT NOT NULL,
    "class_id" TEXT,
    "lesson_code" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Post_lesson_code_fkey" FOREIGN KEY ("lesson_code") REFERENCES "Lesson_list" ("lesson_code") ON DELETE CASCADE ON UPDATE CASCADE
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
