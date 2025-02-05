'use client';

export default function PathInput() {
    const searchParams = new URLSearchParams(window.location.search);
    const refCode = searchParams.get('ref');

	return (
		<input
			type="hidden"
			name="refCode"
			value={refCode || ""}
		/>
	);
}
