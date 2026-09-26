"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBoard, addItemToBoard } from "@/lib/actions/boards";

export function BoardSync({ userId }: { userId: string }) {
  const router = useRouter();

  useEffect(() => {
    async function syncLocalBoard() {
      const stored = localStorage.getItem('zen_arch_local_board');
      if (stored) {
        try {
          const localBoard = JSON.parse(stored);
          if (localBoard && localBoard.items && localBoard.items.length > 0) {
            // Create a board
            const newBoard = await createBoard(localBoard.name || "My Imported Board", "Imported from temporary session", userId);
            
            // Add items
            for (const item of localBoard.items) {
              if (item.product?.id) {
                await addItemToBoard(newBoard.id, item.product.id, undefined, item.quantity, userId);
              }
            }
            
            // Clear local storage
            localStorage.removeItem('zen_arch_local_board');
            router.refresh();
          } else {
             // Just empty, clear it
             localStorage.removeItem('zen_arch_local_board');
          }
        } catch (e) {
          console.error("Failed to sync local board:", e);
        }
      }
    }
    
    syncLocalBoard();
  }, [userId, router]);

  return null;
}
