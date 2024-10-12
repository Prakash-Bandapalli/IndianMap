import * as d3 from "d3";
import { feature } from "topojson-client";
import indiaTopoJson from "../mapData/indiaTopoJson.json";

// Define color constants
export const COLORS = {
  default: "#d9d9d9", // Light gray
  topStates: "#4CAF50", // Green for top states
  bottomStates: "#F44336", // Red for bottom states
};

export const setupMap = (
  svgRef,
  data,
  selectedCategoryRef,
  setTooltipContent,
  setTooltipStyle
) => {
  const svg = d3.select(svgRef.current);
  const width = 975;
  const height = 975;

  const g = svg.select("g");

  const projection = d3
    .geoMercator()
    .scale(1800)
    .center([78.9629, 22.5937])
    .translate([width / 2, height / 2]);

  const pathGenerator = d3.geoPath().projection(projection);

  const states = feature(indiaTopoJson, indiaTopoJson.objects.states);

  // Append paths for each state
  const statePaths = g
    .selectAll(".state")
    .data(states.features)
    .enter()
    .append("path")
    .attr("class", "state")
    .attr("d", pathGenerator)
    .attr("fill", COLORS.default) // Default color for the states
    .attr("stroke", "#333") // Outline color for the states
    .attr("cursor", "pointer")
    .on("mouseover", (e, d) => {
      const stateName = d.properties.name;
      const stateInfo = data.find((state) => state.name === stateName);

      // Get the selected category from the ref
      const selectedCategory = selectedCategoryRef.current;

      if (stateInfo && selectedCategory) {
        setTooltipContent(
          `${stateName} - ${selectedCategory.toUpperCase()}: ${
            stateInfo[selectedCategory]
          }`
        );
      } else {
        setTooltipContent(stateName);
      }

      setTooltipStyle({
        top: e.clientY + 6 + "px",
        left: e.clientX + 6 + "px",
        visibility: "visible",
      });
    })
    .on("mousemove", (e) => {
      requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        setTooltipStyle({
          top: clientY + 6 + "px",
          left: clientX + 6 + "px",
          visibility: "visible",
        });
      });
    })
    .on("mouseout", () => {
      setTooltipStyle({ visibility: "hidden" });
    })
    .on("click", (event, d) => clicked(event, d));

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  svg.call(zoom).on("dblclick.zoom", null);

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
    event.stopPropagation();

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      );
  }

  svg.on("click", function () {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  });

  function zoomed(event) {
    const { transform } = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  // Update colors based on the selected category stored in useRef
  if (selectedCategoryRef.current) {
    const selectedCategory = selectedCategoryRef.current;

    // Reset all states to default color
    g.selectAll(".state").attr("fill", COLORS.default);

    // Sort stateData based on the selected category and get top states
    const topStates = data
      .sort((a, b) => b[selectedCategory] - a[selectedCategory])
      .slice(0, 3); // Get top 3 states

    // Color the top states based on the selected category
    topStates.forEach((state) => {
      g.selectAll(".state")
        .filter((d) => d.properties.name === state.name)
        .attr("fill", COLORS.topStates); // Color the top states
    });

    const bottomStates = data
      .sort((a, b) => a[selectedCategory] - b[selectedCategory])
      .slice(0, 3); // Get bottom 3 states

    bottomStates.forEach((state) => {
      g.selectAll(".state")
        .filter((d) => d.properties.name === state.name)
        .attr("fill", COLORS.bottomStates); // Color the bottom states
    });
  }
};
