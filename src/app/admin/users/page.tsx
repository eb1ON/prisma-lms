"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roles = ["all", "student", "teacher", "admin"];
const courseYears = [1, 2, 3, 4, 5];

const UserManagementPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    user_id: "",
    name: "",
    email: "",
    password: "",
    role: "student",
    school_year: 1,
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.role === filterRole);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);

  const handleAddUser = async () => {
    const formData = new FormData();
    formData.append("user_id", newUser.user_id);
    formData.append("name", newUser.name);
    formData.append("email", newUser.email);
    formData.append("password", newUser.password);
    formData.append("role", newUser.role);
    formData.append("school_year", String(newUser.school_year));
    if (newImage) formData.append("image", newImage);

    const res = await fetch("/api/user", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUsers((prev) => [...prev, data]);
    setNewUser({
      user_id: "",
      name: "",
      email: "",
      password: "",
      role: "student",
      school_year: 1,
    });
    setNewImage(null);
    setIsAddOpen(false);
  };

  const handleEditUser = async () => {
    if (!editUser) return;

    const formData = new FormData();
    formData.append("id", editUser.id);
    formData.append("user_id", editUser.user_id);
    formData.append("name", editUser.name);
    formData.append("email", editUser.email);
    formData.append("role", editUser.role);
    formData.append("school_year", String(editUser.school_year));
    formData.append("currentImage", editUser.image ?? "");
    if (editImage) formData.append("image", editImage);

    const res = await fetch("/api/user", {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    setEditUser(null);
    setEditImage(null);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    await fetch(`/api/user?id=${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-white text-black py-12 px-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-[#e9ebee] text-gray-800 hover:bg-[#5584c6] active:bg-[#5584c6]/50 active:text-gray-800"
          >
            ← Буцах
          </Button>
          <h1 className="text-3xl font-bold text-black text-center w-full border-b border-[#5584c6] pb-4 mb-6">
            👤 Хэрэглэгчийн удирдлага
          </h1>
          <div className="w-24" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Input
            placeholder="Нэр эсвэл имэйлээр хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] w-full md:w-1/2"
          />
          <select
            className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] px-4 py-2 rounded-lg w-full md:w-1/4"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "all" ? "Бүх үүрэг" : role}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center mb-6">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#e9ebee] hover:bg-[#5584c6] text-gray-800 font-semibold px-6 py-2 rounded-lg"
          >
            ➕ Шинэ хэрэглэгч нэмэх
          </Button>
        </div>

        <div className="bg-white p-6 shadow-2xl rounded-xl mb-12 w-full max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm divide-y divide-[#6be4b920]">
            <thead className="bg-[#e9ebee] text-gray-800">
              <tr>
                <th className="px-4 py-3">Зураг</th>
                <th className="px-4 py-3">Код</th>
                <th className="px-4 py-3">Нэр</th>
                <th className="px-4 py-3">Имэйл</th>
                <th className="px-4 py-3">Үүрэг</th>
                <th className="px-4 py-3 text-center">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="">
                  <td className="px-4 py-3">
                    {user.image && (
                      <img
                        src={user.image}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">{user.user_id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setEditUser(user)}
                      className="bg-[#e9ebee] text-gray-800 hover:bg-[#5584c6] border shadow-md"
                    >
                      Засах
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-gray-800 bg-[#e9ebee] border hover:bg-red-500 shadow-md"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Устгах
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ➕ Add Modal */}
        {isAddOpen && (
          <div className="bg-white/70 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border p-6 rounded-xl shadow-2xl w-full max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-center text-black mb-6">
                ➕ Шинэ хэрэглэгч нэмэх
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  value={newUser.user_id}
                  onChange={(e) =>
                    setNewUser({ ...newUser, user_id: e.target.value })
                  }
                  placeholder="ID"
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920]"
                />
                <Input
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Нэр"
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920]"
                />
                <Input
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Имэйл"
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920]"
                />
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Нууц үг"
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920]"
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg px-3 py-2"
                >
                  {roles.slice(1).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <select
                  value={newUser.school_year ?? ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      school_year: parseInt(e.target.value),
                    })
                  }
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg px-3 py-2"
                >
                  <option value="">Курс сонгох</option>
                  {courseYears.map((year) => (
                    <option key={year} value={year}>
                      {year} курс
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="col-span-2 bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg px-3 py-2"
                />
                {newImage && (
                  <img
                    src={URL.createObjectURL(newImage)}
                    alt="Preview"
                    className="col-span-2 w-32 h-32 object-cover rounded-lg mx-auto mt-2"
                  />
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddUser}
                  className="w-full bg-[#e9ebee] border border-[#5584c6] text-gray-800 hover:bg-[#5584c6] font-semibold"
                >
                  Нэмэх
                </Button>
                <Button
                  onClick={() => {
                    setIsAddOpen(false);
                    setNewImage(null);
                  }}
                  variant="outline"
                  className="w-full bg-[#e9ebee] text-gray-800 hover:bg-red-500"
                >
                  Болих
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ✏️ Edit Modal */}
        {editUser && (
          <div className="bg-[#13272e]/90 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f181e] p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-center text-[#6be4b9] mb-6">
                ✏️ Хэрэглэгч засах
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  value={editUser.user_id}
                  onChange={(e) =>
                    setEditUser({ ...editUser, user_id: e.target.value })
                  }
                  placeholder="ID"
                  className="bg-[#0f181e] text-white border border-[#6be4b920]"
                />
                <Input
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="bg-[#0f181e] text-white border border-[#6be4b920]"
                />
                <Input
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="bg-[#0f181e] text-white border border-[#6be4b920]"
                />
                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg px-3 py-2"
                >
                  {roles.slice(1).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <select
                  value={editUser.school_year ?? ""}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      school_year: parseInt(e.target.value),
                    })
                  }
                  className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg px-3 py-2"
                >
                  <option value="">Курс сонгох</option>
                  {courseYears.map((year) => (
                    <option key={year} value={year}>
                      {year} курс
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="col-span-2 bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg px-3 py-2"
                />
                {(editImage || editUser.image) && (
                  <img
                    src={
                      editImage
                        ? URL.createObjectURL(editImage)
                        : editUser.image
                    }
                    alt="Preview"
                    className="col-span-2 w-32 h-32 object-cover rounded-lg mx-auto mt-2"
                  />
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleEditUser}
                  className="w-full bg-[#6be4b9] text-[#0f181e] font-semibold"
                >
                  Хадгалах
                </Button>
                <Button
                  onClick={() => {
                    setEditUser(null);
                    setEditImage(null);
                  }}
                  variant="outline"
                  className="w-full border-[#6be4b9] text-[#6be4b9]"
                >
                  Болих
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
