import { useState } from "react";

// ============================================================
// CUSTOM HOOK — useModalClose
// Mengatur logika penutupan modal dengan animasi sebelum unmount.
// Mendukung animasi feedback berbeda untuk tiap aksi:
//   "update"  → flash hijau (success)
//   "delete"  → flash merah (danger)
//   "cancel"  → flash abu (neutral)
//
// Cara kerja:
// 1. triggerAction(type) → actionType di-set → animasi feedback aktif
// 2. Setelah actionDuration, isClosing = true → animasi closing aktif
// 3. Setelah duration, closeCallback() dipanggil → modal unmount
//
// Return: { isClosing, actionType, triggerAction, closeModal }
// ============================================================
export default function useModalClose(closeCallback, duration = 300) {
  // true saat animasi penutupan sedang berjalan
  const [isClosing, setIsClosing] = useState(false);

  // Tipe aksi yang sedang berlangsung: "update" | "delete" | "cancel" | null
  const [actionType, setActionType] = useState(null);

  // ============================================================
  // FUNGSI — triggerAction
  // Memulai animasi feedback sesuai tipe aksi, lalu menutup modal.
  //   type         : "update" | "delete" | "cancel"
  //   actionDuration: durasi animasi feedback sebelum closing (ms)
  // ============================================================
  const triggerAction = (type, actionDuration = 500) => {
    setActionType(type);

    // Setelah animasi feedback selesai, mulai animasi closing
    setTimeout(() => {
      setIsClosing(true);

      // Setelah animasi closing selesai, panggil callback dan reset semua state
      setTimeout(() => {
        closeCallback();
        setIsClosing(false);
        setActionType(null);
      }, duration);
    }, actionDuration);
  };

  // ============================================================
  // FUNGSI — closeModal (alias untuk aksi "cancel")
  // Shortcut agar komponen lama tetap kompatibel.
  // ============================================================
  const closeModal = () => triggerAction("cancel", 350);

  return { isClosing, actionType, triggerAction, closeModal };
}
