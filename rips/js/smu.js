export const nearlyZero = 0.00001;

export function normalize(v) {
  let lv = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
  if (Math.abs(lv) > nearlyZero) {
    v[0] /= lv;
    v[1] /= lv;
  }
  return v;
}

export function dot(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1]
}
