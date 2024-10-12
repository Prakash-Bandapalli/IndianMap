import { COLORS } from "../utils/setupMap";

function Boxes() {
  return (
    <div className="space-y-3 mt-8 ml-4 font-semibold text-md">
      <div className="flex gap-2 items-center">
        <div
          className="w-8 h-8"
          style={{ backgroundColor: COLORS.topStates }}
        ></div>
        <p>Top 3 States</p>
      </div>
      <div className="flex gap-2 items-center">
        <div
          className="w-8 h-8"
          style={{ backgroundColor: COLORS.bottomStates }}
        ></div>
        <p>Bottom 3 States</p>
      </div>
      <p className="text-sm text-stone-900 font-semibold">
        Click outside the map to zoom out !
      </p>
    </div>
  );
}

export default Boxes;
