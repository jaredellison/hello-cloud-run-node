export default async function task() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, Math.random() * 1000);
  });
}
