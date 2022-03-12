export const toBits =
  (length: number) =>
  (value: number): string => {
    return (value % 2 ** length).toString(2).padStart(length, "0");
  };
