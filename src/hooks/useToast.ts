"use client";

import {useState, useCallback} from "react";
import {ToastProps} from "@/types";

export function useToast() {
	const [toast, setToast] = useState<ToastProps | null>(null);

	const showToast = useCallback(
		(message: string, type: ToastProps["type"] = "success") => {
			setToast({message, type});
			setTimeout(() => setToast(null), 3000);
		},
		[]
	);

	return {toast, showToast};
}
