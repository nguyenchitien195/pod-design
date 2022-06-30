export const getSizeImageToFitPrintArea = (
  imgHeight: number,
  imgWidth: number,
  printAreaHeight: number,
  printAreaWidth: number
): { height: number; width: number } => {
  if (imgWidth > printAreaWidth) {
    const scaleDownWidth = imgWidth / printAreaWidth;
    imgWidth /= scaleDownWidth;
    imgHeight /= scaleDownWidth;
    if (imgHeight > printAreaHeight) {
      const scaleDownHeight = imgHeight / printAreaHeight;
      imgWidth /= scaleDownHeight;
      imgHeight /= scaleDownHeight;
    }
  } else if (imgHeight > printAreaHeight) {
    const scaleDownHeight = imgHeight / printAreaHeight;
    imgWidth /= scaleDownHeight;
    imgHeight /= scaleDownHeight;
    if (imgWidth > printAreaWidth) {
      const scaleDownWidth = imgWidth / printAreaWidth;
      imgWidth /= scaleDownWidth;
      imgHeight /= scaleDownWidth;
    }
  }
  return {
    height: imgHeight,
    width: imgWidth,
  };
};
