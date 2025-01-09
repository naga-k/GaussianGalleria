export default interface SplatUploadPayload {
    name: string,
    description: string | null,
    splatFile: File,
    videoFile: File,
}