export default interface SceneItem {
  id: number;
  name: string | null;
  description: string | null;
  // DB stores keys
  splatKey: string | null;
  videoKey: string | null;
}
