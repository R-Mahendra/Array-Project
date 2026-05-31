import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import logo from "./assets/zx___logo.png";

export default function App() {
  // ============================================================
  // STATE — deleteTaskData
  // Menyimpan data task yang akan dihapus.
  // null = modal hapus tertutup | array task = modal hapus terbuka
  // ============================================================
  const [deleteTaskData, setDeleteTaskData] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  // ============================================================
  // STATE — kategoriList (Array 1D)
  // Daftar kategori yang tersedia untuk task.
  // Diinisialisasi dari localStorage agar persisten antar sesi.
  // Default: ["Kuliah", "Kerja", "Pribadi"]
  // ============================================================
  const [kategoriList, setKategoriList] = useState(() => {
    const savedKategori = localStorage.getItem("kategoriList");
    return savedKategori
      ? JSON.parse(savedKategori)
      : ["Kuliah", "Kerja", "Pribadi"];
  });

  // ============================================================
  // STATE — editTask
  // Menyimpan data task yang sedang diedit.
  // null = modal edit tertutup | array task = modal edit terbuka
  // ============================================================
  const [editTask, setEditTask] = useState(null);

  // ============================================================
  // STATE — tasks (Array 2D)
  // Setiap task adalah sebuah array dengan format:
  // [id, namaTask, deskripsi, tanggal, kategori, priority, status]
  // Diinisialisasi dari localStorage agar data tidak hilang saat refresh.
  // ============================================================
  const [tasks, setTasks] = useState(() => {
    const savedTask = localStorage.getItem("tasks");
    return savedTask ? JSON.parse(savedTask) : [];
  });

  // ============================================================
  // EFEK — Sinkronisasi tasks ke localStorage
  // Dipanggil setiap kali state "tasks" berubah.
  // ============================================================
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ============================================================
  // EFEK — Sinkronisasi kategoriList ke localStorage
  // Dipanggil setiap kali state "kategoriList" berubah.
  // ============================================================
  useEffect(() => {
    localStorage.setItem("kategoriList", JSON.stringify(kategoriList));
  }, [kategoriList]);

  // ============================================================
  // FUNGSI — addTask
  // Menambah task baru ke akhir array tasks menggunakan spread operator.
  // taskBaru: array 7 elemen dari TaskForm
  // ============================================================
  const addTask = (taskBaru) => {
    setTasks([...tasks, taskBaru]);
  };

  // ============================================================
  // FUNGSI — updateTask
  // Mencari task berdasarkan ID (index 0), lalu menggantinya.
  // Setelah update, state editTask direset ke null (menutup modal).
  // ============================================================
  const updateTask = (taskUpdate) => {
    const updated = tasks.map((task) =>
      task[0] === taskUpdate[0] ? taskUpdate : task,
    );
    setTasks(updated);
    setEditTask(null);
  };

  // ============================================================
  // FUNGSI — addKategori
  // Menambah kategori baru jika tidak kosong dan belum terdaftar.
  // Mencegah duplikasi dengan pengecekan .includes().
  // ============================================================
  const addKategori = (kategoriBaru) => {
    if (kategoriBaru.trim() !== "" && !kategoriList.includes(kategoriBaru)) {
      setKategoriList([...kategoriList, kategoriBaru]);
    }
  };

  // ============================================================
  // FUNGSI — toggleTask
  // Membalik nilai boolean status task (index 6: false ↔ true).
  // Memindahkan task antara list "In Progress" dan "Selesai".
  // ============================================================
  const toggleTask = (id) => {
    const updated = tasks.map((task) => {
      if (task[0] === id) {
        return [task[0], task[1], task[2], task[3], task[4], task[5], !task[6]];
      }
      return task;
    });
    setTasks(updated);
  };

  // ============================================================
  // FUNGSI — deleteTask
  // Menghapus task dari array berdasarkan ID menggunakan .filter().
  // Mereset deleteTaskData ke null untuk menutup modal konfirmasi.
  // ============================================================
  const deleteTask = (id) => {
    const filtered = tasks.filter((task) => task[0] !== id);
    setTasks(filtered);
    setDeleteTaskData(null);
  };

  // ============================================================
  // FILTER — Memisahkan task berdasarkan status
  // belumSelesai : task dengan status false (In Progress)
  // selesai      : task dengan status true (Done)
  // ============================================================
  const belumSelesai = tasks.filter((task) => task[6] === false);
  const selesai = tasks.filter((task) => task[6] === true);

  // ============================================================
  // RENDER
  // ============================================================

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-block">
        <h1 className="mb-0">Akses Ditolak...!</h1>
        <h3>Aplikasi ini hanya dapat digunakan pada Desktop atau Laptop.</h3>
      </div>
    );
  }
  return (
    <section>
      <div className="container px-5">
        <div className="row d-flex justify-content-center align-items-center">
          {/* Header Aplikasi */}
          <div className="col-lg-12 d-flex justify-content-between  align-items-center">
            <div className="cards">
              <img
                src={logo}
                alt="Logo"
                className="logo img-fluid logo-animation"
              />
            </div>
            <h1 className="mb-0 title-animation">
              <span>Kelompok </span>5
            </h1>
          </div>
          <hr className="line-animation d-block" />

          {/* Form untuk menambah task baru */}
          <TaskForm
            kategoriList={kategoriList}
            addKategori={addKategori}
            addTask={addTask}
          />

          {/* Daftar task yang belum selesai */}
          <TaskList
            title="In Progress"
            tasks={belumSelesai}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            setEditTask={setEditTask}
            setDeleteTaskData={setDeleteTaskData}
          />

          {/* Daftar task yang sudah selesai */}
          <TaskList
            title="Completed"
            tasks={selesai}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            setEditTask={setEditTask}
            setDeleteTaskData={setDeleteTaskData}
          />
          {/* Modal edit task */}
          <EditModal
            editTask={editTask}
            setEditTask={setEditTask}
            updateTask={updateTask}
            kategoriList={kategoriList}
          />
          {/* Modal konfirmasi hapus task */}
          <DeleteModal
            deleteTaskData={deleteTaskData}
            setDeleteTaskData={setDeleteTaskData}
            deleteTask={deleteTask}
          />
        </div>
      </div>
    </section>
  );
}
