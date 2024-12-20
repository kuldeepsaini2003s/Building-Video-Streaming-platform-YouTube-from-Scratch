import { toast } from "react-toastify";

const useResponseHandler = () => {
  const handleResponse = ({
    status,
    message,
    onSuccess = () => {},
    onError = () => {},
    toastId,
  }) => {
    const errorStatusCodes = [400, 401, 402, 403, 404, 409, 500];

    if (status === 200) {
      toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      onSuccess();
    } else if (errorStatusCodes.includes(status)) {
      toast.update(toastId, {
        render: message || "An error occurred",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      onError();
    }
  };

  const handleError = ({
    error,
    toastId,
    message = "Something went wrong!",
  }) => {
    console.error("Error:", error);
    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 3000,
      pauseOnFocusLoss: false,
      closeOnClick: true,
    });
  };

  return { handleResponse, handleError };
};

export default useResponseHandler;
