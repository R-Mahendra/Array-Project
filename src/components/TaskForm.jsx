import { useState } from "react";

// ============================================================
// KOMPONEN — TaskForm
// Formulir untuk menambahkan task baru ke daftar.
//
// Props:
//   kategoriList : array string kategori yang tersedia
//   addTask      : fungsi untuk menambah task ke state parent
// ============================================================
export default function TaskForm({ kategoriList, addTask }) {
  // ============================================================
  // STATE — Field-field formulir (controlled inputs)
  // ============================================================
  const [namaTask, setNamaTask] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [kategori, setKategori] = useState(kategoriList[0] || "");
  const [priority, setPriority] = useState("Low");

  // ============================================================
  // FUNGSI — handleSubmit
  // Validasi input, buat array task baru, dan kirim ke parent.
  // Format task: [id, nama, deskripsi, tanggal, kategori, priority, status]
  // ID menggunakan Date.now() agar unik.
  // Status default false (belum selesai).
  // ============================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi: nama dan tanggal wajib diisi
    if (namaTask.trim() === "" || tanggal === "") return;

    const taskBaru = [
      Date.now(), // [0] id — unik berdasarkan timestamp
      namaTask, // [1] nama task
      deskripsi, // [2] deskripsi / catatan
      tanggal, // [3] tanggal deadline
      kategori, // [4] kategori
      priority, // [5] prioritas: Low | Medium | High
      false, // [6] status: false = belum selesai
    ];

    addTask(taskBaru);

    // Reset semua field setelah submit
    setNamaTask("");
    setDeskripsi("");
    setTanggal("");
    setKategori(kategoriList[0] || "");
    setPriority("Low");
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="card form-container py-3">
      <form onSubmit={handleSubmit} className="form">
        <div className="row d-flex justify-content-center align-items-center">
          <h4 className="mb-0">+ New Task</h4>

          {/* Input nama task */}
          <div className="col-lg-5 d-flex justify-content-center align-items-center mt-3">
            <input type="text" className="form-control zx--form p-3" placeholder="Task Name" value={namaTask} onChange={(e) => setNamaTask(e.target.value)} />
          </div>

          {/* Input tanggal deadline */}
          <div className="col-lg-2 d-flex justify-content-center align-items-center mt-3">
            <input type="date" className="form-control zx--form p-3" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>

          {/* Pilih kategori dari kategoriList */}
          <div className="col-lg-2 d-flex justify-content-center align-items-center mt-3">
            <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="form-selects">
              {kategoriList.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Pilih level prioritas */}
          <div className="col-lg-2 d-flex justify-content-center align-items-center mt-3">
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-selects">
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>

          {/* Tombol submit */}
          <div className="col-lg-1 d-flex justify-content-center align-items-center mt-3">
            <button type="submit" className="btn-addTask">
              Add Task
            </button>
          </div>
        </div>

        {/* Textarea deskripsi / catatan tambahan */}
        <div className="col-lg-12 d-flex justify-content-center align-items-center mt-3">
          <textarea placeholder="Notes or description..." value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="p-3 form-control zx--form" />
        </div>
      </form>
    </div>
  );
}
