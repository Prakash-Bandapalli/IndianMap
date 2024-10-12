import { useEffect, useRef, useState } from "react";

import { setupMap } from "./utils/setupMap";
import stateData from "./mapData/stateData";
import Button from "./ui/Button";
import Boxes from "./ui/Boxes";

const IndianMap = () => {
  const svgRef = useRef();
  const selectedCategoryRef = useRef("");
  const [disabledButton, setDisabledButton] = useState("");
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipStyle, setTooltipStyle] = useState({ visibility: "hidden" });
  const [data, setData] = useState(stateData);

  useEffect(() => {
    // Call setupMap function
    setupMap(
      svgRef,
      data,
      selectedCategoryRef,
      setTooltipContent,
      setTooltipStyle
    );
  }, [data]);

  const handleCategorySelect = (category) => {
    selectedCategoryRef.current = category; // Update the selected category in useRef
    setDisabledButton(category); // Disable the selected button

    // Manually trigger a re-render
    setData([...data]); // This will trigger a re-render
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 left-0 p-4 h-auto">
        <Button
          dataType="economy"
          onHandleCategory={handleCategorySelect}
          stateButton={disabledButton}
        >
          Economy
        </Button>
        <Button
          dataType="literacyRate"
          onHandleCategory={handleCategorySelect}
          stateButton={disabledButton}
        >
          Literacy Rate
        </Button>
        <Button
          dataType="gdp"
          onHandleCategory={handleCategorySelect}
          stateButton={disabledButton}
        >
          GDP
        </Button>
        <Boxes />
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 975 975"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <g />
      </svg>

      <div
        className="fixed bg-yellow-300 rounded-b-md"
        style={{
          ...tooltipStyle,
          pointerEvents: "none",
        }}
      >
        <div className="bg-black text-white mb-1 p-2 ">{tooltipContent}</div>
      </div>
    </div>
  );
};

export default IndianMap;
