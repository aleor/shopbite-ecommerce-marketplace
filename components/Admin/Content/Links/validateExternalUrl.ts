export const linkUrlIsAllowed = (url: string) => {
  // should start with http:// or https:// to properly construct the external urls on client side
  if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
    return false;
  }

  // general url validation
  const regex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(url);
};
