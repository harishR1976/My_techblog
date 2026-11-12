const calculateReadingTime = (content = '') => {
  const plainText = content.replace(/<[^>]*>/g, ' ').trim();
  const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / 200));
};

module.exports = calculateReadingTime;
