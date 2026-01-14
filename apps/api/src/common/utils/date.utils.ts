export const getMinutesRemaining = (date: Date): number => {
	const now = new Date();
	const minutesRemaining = Math.ceil((date.getTime() - now.getTime()) / 60000);

	return minutesRemaining;
};
