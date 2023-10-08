export const parseJSONSafely = (input: string): string => {
  try {
    return JSON.parse(input);
  } catch (error) {
    return input;
  }
};
