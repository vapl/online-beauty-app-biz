export const handleError = (error: any, context: string = "") => {
  console.error(`Error ${context ? context : ""}: `, error);
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || "Unknown error",
    };
  } else {
    return {
      success: false,
      message: "Unknown error.",
    };
  }
};
