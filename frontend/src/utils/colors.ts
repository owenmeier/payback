export const PERSON_COLORS = [
	{
		bg: "bg-blue-500",
		text: "text-blue-500",
		light: "bg-blue-100",
		name: "blue",
	},
	{
		bg: "bg-green-500",
		text: "text-green-500",
		light: "bg-green-100",
		name: "green",
	},
	{
		bg: "bg-purple-500",
		text: "text-purple-500",
		light: "bg-purple-100",
		name: "purple",
	},
	{
		bg: "bg-pink-500",
		text: "text-pink-500",
		light: "bg-pink-100",
		name: "pink",
	},
	{
		bg: "bg-yellow-500",
		text: "text-yellow-500",
		light: "bg-yellow-100",
		name: "yellow",
	},
	{ bg: "bg-red-500", text: "text-red-500", light: "bg-red-100", name: "red" },
	{
		bg: "bg-indigo-500",
		text: "text-indigo-500",
		light: "bg-indigo-100",
		name: "indigo",
	},
	{
		bg: "bg-teal-500",
		text: "text-teal-500",
		light: "bg-teal-100",
		name: "teal",
	},
	{
		bg: "bg-orange-500",
		text: "text-orange-500",
		light: "bg-orange-100",
		name: "orange",
	},
	{
		bg: "bg-cyan-500",
		text: "text-cyan-500",
		light: "bg-cyan-100",
		name: "cyan",
	},
];

export const getPersonColor = (index: number) => {
	return PERSON_COLORS[index % PERSON_COLORS.length];
};

export const getInitials = (name: string): string => {
	const parts = name.trim().split(" ");
	if (parts.length === 1) {
		return parts[0].substring(0, 2).toUpperCase();
	}
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
