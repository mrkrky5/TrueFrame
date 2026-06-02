/** expo-image disk cache — görseller ilk indirmeden sonra çevrimdışı kalır. */
export const cachedImageProps = {
  cachePolicy: "disk" as const,
  transition: 200,
};
