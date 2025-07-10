export function unique<T>(a: T[]) {
  return a.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });
}
