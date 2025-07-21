export function generateRandomReels(count = 5): number[][] {
	return Array.from({ length: count }, () => generateRandomSlots());
}

function generateRandomSlots(count = 30, max = 11): number[] {
	return Array.from({ length: count }, () => Math.floor(Math.random() * max));
}
