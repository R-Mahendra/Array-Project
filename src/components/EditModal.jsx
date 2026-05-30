/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import useModalClose from "../hooks/useModalClose";

// ============================================================
// KOMPONEN — EditModal
// Modal edit task dengan animasi feedback per aksi:
//   Update → flash hijau (update)
//   Batal  → flash abu   (cancel)
// ============================================================
export default function EditModal({ editTask, setEditTask, updateTask, kategoriList }) {
  // ============================================================
  // STATE — Field-field form edit (controlled inputs)
  // ============================================================
  const [namaTask, setNamaTask] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [kategori, setKategori] = useState("");
  const [priority, setPriority] = useState("Low");

  // ============================================================
  // HOOK — useModalClose
  // triggerAction("update") → animasi hijau → modal tutup
  // triggerAction("cancel") → animasi abu  → modal tutup
  // ============================================================
  const { isClosing, actionType, triggerAction } = useModalClose(() => setEditTask(null), 300);

  // ============================================================
  // EFEK — Load data task ke dalam form saat editTask berubah
  // ============================================================
  useEffect(() => {
    if (editTask) {
      setNamaTask(editTask[1]);
      setDeskripsi(editTask[2]);
      setTanggal(editTask[3]);
      setKategori(editTask[4]);
      setPriority(editTask[5]);
    }
  }, [editTask]);

  // ============================================================
  // FUNGSI — handleUpdate
  // Simpan perubahan task lalu trigger animasi "update" (flash hijau).
  // ============================================================
  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedTask = [
      editTask[0], // [0] id — tidak berubah
      namaTask, // [1] nama task (baru)
      deskripsi, // [2] deskripsi (baru)
      tanggal, // [3] tanggal (baru)
      kategori, // [4] kategori (baru)
      priority, // [5] prioritas (baru)
      editTask[6], // [6] status — dipertahankan
    ];

    updateTask(updatedTask);
    triggerAction("update", 500);
  };

  // ============================================================
  // FUNGSI — handleCancel
  // Trigger animasi "cancel" (flash abu) sebelum modal tutup.
  // ============================================================
  const handleCancel = () => {
    triggerAction("cancel", 350);
  };

  // Jika tidak ada task yang diedit, tidak render apapun
  if (!editTask) return null;

  // ============================================================
  // RENDER
  // Class dinamis: "closing", "action-update", "action-cancel"
  // ============================================================
  return (
    <div className="modal-overlay">
      <div className={["modal", isClosing ? "closing" : "", actionType === "update" ? "action-update" : "", actionType === "cancel" ? "action-cancel" : ""].filter(Boolean).join(" ")}>
        <form onSubmit={handleUpdate}>
          <div className="container">
            <div className="row d-flex justify-content-center align-items-center mt-3">
              <h2>
                Edit <span>Task</span>
              </h2>

              {/* Input nama task */}
              <div className="col-lg-12 mb-3">
                <input type="text" className="form-control zx--form p-3" placeholder="Nama Task" value={namaTask} onChange={(e) => setNamaTask(e.target.value)} disabled={!!actionType} />
              </div>

              {/* Textarea deskripsi */}
              <div className="col-lg-12 mb-3">
                <textarea rows="4" placeholder="Notes or description..." value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="form-control zx--form" disabled={!!actionType} />
              </div>

              {/* Input tanggal deadline */}
              <div className="col-lg-12 mb-3">
                <input type="date" className="form-control zx--form p-3" value={tanggal} onChange={(e) => setTanggal(e.target.value)} disabled={!!actionType} />
              </div>

              {/* Pilih kategori & prioritas */}
              <div className="kategoriForm d-flex justify-content-center align-items-center">
                <div className="col-lg-6 mb-3 me-1">
                  <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="form-selects" disabled={!!actionType}>
                    {kategoriList.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-6 mb-3 ms-1">
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-selects" disabled={!!actionType}>
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                </div>
              </div>

              {/* Tombol Update & Batal */}
              <div className="buttons d-flex justify-content-center align-items-center">
                <button type="submit" className="btn-update" disabled={!!actionType}>
                  {actionType === "update" ? (
                    <>
                      <i className="bi bi-check2-all me-1"></i>Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-floppy me-1"></i>Update
                    </>
                  )}
                </button>

                <button type="button" className="btn-cancel" onClick={handleCancel} disabled={!!actionType}>
                  {actionType === "cancel" ? (
                    <>
                      <i className="bi bi-x-circle me-1"></i>Membatalkan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-left me-1"></i>Batal
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
