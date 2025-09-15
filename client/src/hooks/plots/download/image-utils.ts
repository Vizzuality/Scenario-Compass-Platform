export const createSVGLegendFromDOM = (
  legendElement: HTMLElement,
  svgWidth: number,
): SVGElement => {
  const legendSvg = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const legendItems = legendElement.querySelectorAll('[class*="flex"][class*="items-center"]');

  const itemHeight = 25;
  const padding = 20;

  let currentX = 0;
  let currentY = 20;

  legendItems.forEach((item) => {
    const colorElement = item.querySelector('div[style*="background-color"]') as HTMLElement;
    const textElement = item.querySelector("span");

    if (colorElement && textElement) {
      const itemRect = (item as HTMLElement).getBoundingClientRect();
      const itemWidth = itemRect.width + padding;

      // Extract data
      const text = textElement.textContent || "";
      const style = colorElement.getAttribute("style") || "";
      const colorMatch = style.match(/background-color:\s*([^;]+)/);
      const color = colorMatch ? colorMatch[1].trim() : "#000";

      // Check if item fits in current row
      if (currentX + itemWidth > svgWidth && currentX > 0) {
        currentX = 0;
        currentY += itemHeight;
      }

      // Create legend item group
      const itemGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // Create colored circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", (currentX + 6).toString());
      circle.setAttribute("cy", (currentY + 8).toString());
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", color);
      circle.setAttribute("stroke", "#000");
      circle.setAttribute("stroke-width", "1");

      // Create text
      const textSvg = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textSvg.setAttribute("x", (currentX + 18).toString());
      textSvg.setAttribute("y", (currentY + 12).toString());
      textSvg.setAttribute("font-family", "Arial, sans-serif");
      textSvg.setAttribute("font-size", "12");
      textSvg.setAttribute("fill", "#000");
      textSvg.textContent = text;

      itemGroup.appendChild(circle);
      itemGroup.appendChild(textSvg);
      legendSvg.appendChild(itemGroup);

      currentX += itemWidth;
    }
  });

  return legendSvg;
};

export const downloadDivAsPNG = (
  chartElement: HTMLDivElement,
  legendElement: HTMLElement | null,
  filename: string = "chart.png",
  title?: string,
  subtitle?: string,
  paddingOptions: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    all?: number;
  } = {},
) => {
  const svg = chartElement.querySelector("svg");
  if (!svg) return;

  const svgRect = svg.getBoundingClientRect();
  const legendRect = legendElement?.getBoundingClientRect();

  // Default padding values
  const padding = {
    top: paddingOptions.all ?? paddingOptions.top ?? 20,
    right: paddingOptions.all ?? paddingOptions.right ?? 20,
    bottom: paddingOptions.all ?? paddingOptions.bottom ?? 20,
    left: paddingOptions.all ?? paddingOptions.left ?? 20,
  };

  // Title and subtitle configuration
  const titleFontSize = 18;
  const subtitleFontSize = 14;
  const titleLineHeight = 25;
  const subtitleLineHeight = 20;
  const titleSubtitleGap = 5;

  // Calculate header height based on what we have
  let headerHeight = 0;
  if (title) {
    headerHeight += titleLineHeight;
    if (subtitle) {
      headerHeight += subtitleLineHeight + titleSubtitleGap;
    }
    headerHeight += 15; // Bottom margin
  }

  // Create new SVG that combines everything with padding
  const combinedSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const contentWidth = Math.max(svgRect.width, legendRect?.width || 0);
  const legendHeight = legendRect?.height || 0;
  const contentHeight = svgRect.height + legendHeight + (legendRect ? 40 : 0); // Only add spacing if legend exists

  const totalWidth = contentWidth + padding.left + padding.right;
  const totalHeight = contentHeight + padding.top + padding.bottom + headerHeight;

  combinedSvg.setAttribute("width", totalWidth.toString());
  combinedSvg.setAttribute("height", totalHeight.toString());
  combinedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // Add white background
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", "100%");
  background.setAttribute("height", "100%");
  background.setAttribute("fill", "white");
  combinedSvg.appendChild(background);

  let currentY = padding.top;

  // Add title if provided
  if (title) {
    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleText.setAttribute("x", (totalWidth / 2).toString());
    titleText.setAttribute("y", (currentY + titleFontSize).toString());
    titleText.setAttribute("text-anchor", "middle");
    titleText.setAttribute("font-family", "Arial, sans-serif");
    titleText.setAttribute("font-size", titleFontSize.toString());
    titleText.setAttribute("font-weight", "bold");
    titleText.setAttribute("fill", "#333");
    titleText.textContent = title;
    combinedSvg.appendChild(titleText);

    currentY += titleLineHeight;

    // Add subtitle if provided
    if (subtitle) {
      const subtitleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      subtitleText.setAttribute("x", (totalWidth / 2).toString());
      subtitleText.setAttribute("y", (currentY + titleSubtitleGap + subtitleFontSize).toString());
      subtitleText.setAttribute("text-anchor", "middle");
      subtitleText.setAttribute("font-family", "Arial, sans-serif");
      subtitleText.setAttribute("font-size", subtitleFontSize.toString());
      subtitleText.setAttribute("font-weight", "normal");
      subtitleText.setAttribute("fill", "#666");
      subtitleText.textContent = subtitle;
      combinedSvg.appendChild(subtitleText);

      currentY += subtitleLineHeight + titleSubtitleGap;
    }

    currentY += 15; // Bottom margin
  }

  // Create content group with padding offset (and header space)
  const contentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  contentGroup.setAttribute("transform", `translate(${padding.left}, ${currentY})`);

  // Add legend as SVG elements if it exists
  if (legendElement && legendRect) {
    const legendSvg = createSVGLegendFromDOM(legendElement, contentWidth);
    contentGroup.appendChild(legendSvg);
  }

  // Add chart content
  const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  chartGroup.setAttribute("transform", `translate(0, ${legendHeight + (legendRect ? 20 : 0)})`);

  // Clone the original SVG content
  chartGroup.innerHTML = svg.innerHTML;
  contentGroup.appendChild(chartGroup);

  // Add the content group to the main SVG
  combinedSvg.appendChild(contentGroup);

  // Convert to PNG using clean SVG (no foreignObject)
  const svgData = new XMLSerializer().serializeToString(combinedSvg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = totalWidth * 2; // Higher resolution
  canvas.height = totalHeight * 2;

  const img = new Image();
  img.onload = () => {
    if (ctx) {
      ctx.scale(2, 2);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, totalWidth, totalHeight);
      ctx.drawImage(img, 0, 0, totalWidth, totalHeight);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(pngUrl);
      }
    }, "image/png");

    URL.revokeObjectURL(url);
  };

  img.onerror = (error) => {
    console.error("Image load failed:", error);
    // Fallback: download SVG directly
    const svgLink = document.createElement("a");
    svgLink.href = url;
    svgLink.download = filename.replace(".png", ".svg");
    svgLink.click();
    URL.revokeObjectURL(url);
  };

  img.src = url;
};
