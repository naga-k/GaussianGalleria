export default interface VideoItem {
  id: number;
  name: string;
  // store keys (not signed URLs) in DB layer naming
  srcKey: string;
  splatKey: string;
}
