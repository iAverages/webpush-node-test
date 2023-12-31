export const registerServiceWorker = () => {
  return navigator.serviceWorker.register("/sw.js");
};

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
};

export const resetServiceWorker = async () => {
  await unregisterServiceWorkers();
  return registerServiceWorker();
};
