/**
 * Utility function to crop an image based on the provided cropping area.
 * @param {string} imageSrc - The source URL of the image to crop.
 * @param {Object} crop - The cropping area pixels (x, y, width, height).
 * @returns {Promise<string>} - A promise that resolves to the cropped image as a data URL.
 */
export const getCroppedImg = async (imageSrc, crop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    }, "image/jpeg");
  });
};

/**
 * Helper function to create an HTMLImageElement from a source URL.
 * @param {string} src - The source URL of the image.
 * @returns {Promise<HTMLImageElement>} - A promise that resolves to the image element.
 */
export const createImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  });
};
