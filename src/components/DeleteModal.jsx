import useModalClose from "../hooks/useModalClose";

// ============================================================
// KOMPONEN — DeleteModal
// Modal konfirmasi sebelum menghapus task.
// Animasi feedback:
//   Hapus → flash merah (delete)
//   Batal → flash abu  (cancel)
// ============================================================
export default function DeleteModal({ deleteTaskData, setDeleteTaskData, deleteTask }) {
  // ============================================================
  // HOOK — useModalClose
  // triggerAction("delete") → animasi merah → modal tutup
  // triggerAction("cancel") → animasi abu  → modal tutup
  // ============================================================
  const { isClosing, actionType, triggerAction } = useModalClose(() => setDeleteTaskData(null), 300);

  // ============================================================
  // FUNGSI — handleDelete
  // Hapus task lalu trigger animasi "delete" (flash merah).
  // ============================================================
  const handleDelete = () => {
    deleteTask(deleteTaskData[0]);
    triggerAction("delete", 450);
  };

  // ============================================================
  // FUNGSI — handleCancel
  // Trigger animasi "cancel" (flash abu) sebelum modal tutup.
  // ============================================================
  const handleCancel = () => {
    triggerAction("cancel", 350);
  };

  // Jika tidak ada task target, tidak render apapun
  if (!deleteTaskData) return null;

  // ============================================================
  // RENDER
  // Class dinamis: "closing" untuk animasi tutup,
  // "action-delete" / "action-cancel" untuk animasi feedback.
  // ============================================================
  return (
    <div className="modal-overlay delete">
      <div className={["modal", isClosing ? "closing" : "", actionType === "delete" ? "action-delete" : "", actionType === "cancel" ? "action-cancel" : ""].filter(Boolean).join(" ")}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="mb-0">
                Hapus <span>Task.!</span>
              </h2>
              <h4>Yakin ingin menghapus.?</h4>
            </div>
          </div>
        </div>

        {/* Nama task yang akan dihapus */}
        <strong>Task : {deleteTaskData[1]}</strong>

        {/* Tombol aksi */}
        <div className="modal-button">
          <button className="btn-update" onClick={handleDelete} disabled={!!actionType}>
            {/* Icon berubah saat aksi berjalan */}
            {actionType === "delete" ? (
              <>
                <i className="bi bi-check2-circle me-1"></i>Menghapus...
              </>
            ) : (
              <>
                <i className="bi bi-trash3 me-1"></i>Hapus
              </>
            )}
          </button>

          <button className="btn-cancel" onClick={handleCancel} disabled={!!actionType}>
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
  );
}
