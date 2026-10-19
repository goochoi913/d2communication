"use client";

import { useCallback, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ConfirmOptions } from "./context";

/** `confirm()` that returns a promise, backed by one shadcn AlertDialog. */
export function useConfirm(cancelLabel: string) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback((o: ConfirmOptions) => {
    resolver.current?.(false);
    setOptions(o);
    return new Promise<boolean>((resolve) => (resolver.current = resolve));
  }, []);

  const settle = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setOptions(null);
  };

  const dialog = (
    <AlertDialog open={!!options} onOpenChange={(o) => !o && settle(false)}>
      <AlertDialogContent className="dark" data-lenis-prevent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          {options?.body ? <AlertDialogDescription>{options.body}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11" onClick={() => settle(false)}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={options?.destructive ? "h-11 bg-[#CC0606] text-white hover:bg-[#b00505]" : "h-11"}
            onClick={() => settle(true)}
          >
            {options?.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, dialog };
}
