/* eslint-disable react/prop-types */
function Button({ children, dataType, onHandleCategory, stateButton }) {
  return (
    <button
      onClick={() => onHandleCategory(dataType)}
      className={`bg-purple-500 text-white px-4 py-2 rounded m-1 hover:-translate-y-0.5 hover:shadow-lg shadow-sm hover:bg-opacity-30 transition-all duration-200 ${
        stateButton === dataType ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={stateButton === dataType}
    >
      {children}
    </button>
  );
}

export default Button;
