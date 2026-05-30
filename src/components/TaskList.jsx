// ============================================================
// KOMPONEN — TaskList
// Menampilkan daftar task dalam bentuk tabel.
// Digunakan dua kali: untuk task "In Progress" dan "Selesai".
//
// Props:
//   title            : judul section ("In Progress" / "Selesai")
//   tasks            : array task yang akan ditampilkan
//   toggleTask       : fungsi toggle status selesai/belum
//   setEditTask      : membuka modal edit dengan data task
//   setDeleteTaskData: membuka modal hapus dengan data task
// ============================================================
export default function TaskList({ title, tasks, toggleTask, setEditTask, setDeleteTaskData }) {
  // ============================================================
  // FUNGSI — isDeadlinePassed
  // Mengecek apakah tanggal deadline task sudah terlewat.
  // Perbandingan dilakukan pada level hari (tanpa jam/menit/detik).
  // Return: true jika deadline sudah lewat
  // ============================================================
  const isDeadlinePassed = (tanggal) => {
    const today = new Date();
    const taskDate = new Date(tanggal);
    return taskDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  // ============================================================
  // FUNGSI — getLateDays
  // Menghitung berapa hari keterlambatan task.
  // Selisih waktu dalam ms dikonversi ke hari dengan Math.floor.
  // Return: jumlah hari keterlambatan (number)
  // ============================================================
  const getLateDays = (tanggal) => {
    const today = new Date();
    const taskDate = new Date(tanggal);
    const diffTime = today - taskDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="section py-2" id="task-list">
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center my-1">
          {/* Header section dengan judul dan jumlah task */}
          <div className="col-lg-12 p-0">
            <h2 className="Progres mb-0">
              {title}
              <span className="taskcount">{tasks.length}</span>
            </h2>
            <hr />
          </div>
        </div>

        <div className="row" id="cardParent">
          {/* Baris header kolom tabel */}
          <div className="col-lg-12 d-flex justify-content-center align-items-center p-0">
            <div className="cardList w-100 d-flex justify-content-center align-items-center">
              <div className="col-lg-2">
                <h4 className="card-title">Task</h4>
              </div>
              <div className="col-lg-2">
                <h4 className="card-title text-center">Tanggal</h4>
              </div>
              <div className="col-lg-2">
                <h4 className="card-title text-center">Kategori</h4>
              </div>
              <div className="col-lg-2">
                <h4 className="card-title text-center">Priority</h4>
              </div>
              <div className="col-lg-2">
                <h4 className="card-title text-center">Status</h4>
              </div>
              <div className="col-lg-2">
                <h4 className="card-title text-center">Actions</h4>
              </div>
            </div>
          </div>

          {/* Area scroll untuk daftar task */}
          <div className="task-scroll">
            {tasks.map((task) => (
              <div key={task[0]} className={`col-lg-12 d-flex justify-content-center p-0 ${isDeadlinePassed(task[3]) && !task[6] ? "deadline" : ""}`}>
                <div className="cardList-item w-100 d-flex justify-content-center align-items-center" id="cardList-item">
                  {/* Kolom 1: Nama & deskripsi task (dicoret jika selesai) */}
                  <div className="col-lg-2">
                    <div className={task[6] ? "text-decoration-line-through" : ""}>
                      <h4 className="card-title">{task[1]}</h4>
                      <div className="desk">
                        <p className="m-0">{task[2]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Kolom 2: Tanggal + indikator keterlambatan */}
                  <div className="col-lg-2">
                    <h4 className="card-title text-center">{task[3]}</h4>
                    {isDeadlinePassed(task[3]) && !task[6] && <span className="d-block deadline-text text-center">Telat {getLateDays(task[3])} hari</span>}
                  </div>

                  {/* Kolom 3: Badge kategori */}
                  <div className="col-lg-2 d-flex justify-content-center align-items-center">
                    <div className="kategoris">
                      <h4 className="card-title text-center kategori">{task[4]}</h4>
                    </div>
                  </div>

                  {/* Kolom 4: Badge prioritas (Low/Medium/High) */}
                  <div className="col-lg-2">
                    <div className="badge">
                      <h4 className={`card-title text-center ${"badge-" + task[5]}`}>{task[5]}</h4>
                    </div>
                  </div>

                  {/* Kolom 5: Status selesai/belum + indikator telat */}
                  <div className="col-lg-2">
                    <div className="text-center">
                      {task[6] ? (
                        // Task selesai
                        <div className="badge">
                          <h4 className="card-title badge-Low">
                            Selesai <i className="bi bi-check2-circle"></i>
                          </h4>
                        </div>
                      ) : (
                        // Task belum selesai
                        <>
                          <div className="badge">
                            <h4 className="card-title badge-Medium">Belum</h4>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Kolom 6: Tombol aksi — Done/Undo, Edit, Hapus */}
                  <div className="col-lg-2 d-flex justify-content-center align-items-center">
                    {/* Toggle status selesai */}
                    <button className={`btn ${task[6] ? "btn-undo" : "btn-done"}`} onClick={() => toggleTask(task[0])}>
                      {task[6] ? (
                        <div className="d-flex justify-content-center align-items-center">
                          <i className="bi bi-arrow-clockwise"></i> Undo
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center">
                          <i className="bi bi-check2-circle"></i> Done
                        </div>
                      )}
                    </button>

                    {/* Buka modal edit */}
                    <button className="btn btn-edit mx-2" onClick={() => setEditTask(task)}>
                      Edit
                    </button>

                    {/* Buka modal konfirmasi hapus */}
                    <button className="btn btn-delete" onClick={() => setDeleteTaskData(task)}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
