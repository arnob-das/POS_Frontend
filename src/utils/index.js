export const getRandomBg = () => {
  const colors = [
    "bg-blue-600",
    "bg-green-600",
    "bg-red-600",
    "bg-yellow-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-orange-600",
    "bg-cyan-600",
    "bg-teal-600",
    "bg-lime-600",
    "bg-indigo-600",
    "bg-fuchsia-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-violet-600",
    "bg-sky-600",
    "bg-amber-600",
    "bg-emerald-600",
    "bg-violet-600",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
