import { toast } from "react-toastify";

const tryCatchWrapper = async (apiFunction) => {
  try {
    const response = await apiFunction();

    return { success: true, data: response };
  } catch (error) {
    // Redux Toolkit unwrap() ya direct API dono ka support
    const errorMessage =
      error?.data?.error?.[0]?.message || // unwrap format
      error?.error?.[0]?.message ||       // normal API format
      error?.message ||
      "An error occurred";

    console.error("Error:", error);

    toast.error(errorMessage); // ✅ Show error toast
    return { success: false, error: errorMessage };
  }
};

export default tryCatchWrapper;
