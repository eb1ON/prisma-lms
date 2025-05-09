"use client";

import { useState } from "react";
import Link from "next/link";

export default function UserList({
  users,
}: {
  users: { user_id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const searchWords = search.toLowerCase().split(" ").filter(Boolean);
    const nameParts = user.name.toLowerCase().split(" ");

    if (searchWords.length === 0) return true;

    return searchWords.every((word) =>
      nameParts.some((namePart) => namePart.startsWith(word))
    );
  });

  return (
    <div className="bg-card rounded-xl pt-4 mt-8 mb-4 w-full h-[calc(100vh-260px)] overflow-y-auto border border-border">
      <div className="px-4 mb-4 sticky top-0 bg-card pt-2 border-b border-border">
        <input
          type="text"
          placeholder="Хэрэглэгч хайх..."
          className="w-full p-2 bg-muted text-foreground border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="space-y-2 px-4 pb-4">
        {filteredUsers.map((user) => (
          <li
            key={user.user_id}
            className="flex items-center space-x-3 p-2 hover:bg-primary/70 rounded-full transition-all"
          >
            <img
              src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
              className="w-10 h-10 rounded-full shadow"
            />
            <Link
              href={`/communicate/${user.user_id}`}
              className="text-foreground hover:text-primary-foreground text-md font-semibold transition-all"
            >
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
