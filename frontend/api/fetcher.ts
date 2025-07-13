export default function fetcher(args) {
  return fetch(args)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        console.warn(data.error);
        throw new Error();
      }

      return data;
    });
}
