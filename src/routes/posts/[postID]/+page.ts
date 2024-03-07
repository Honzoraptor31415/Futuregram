export async function load({ params }: any) {
  const postID = params.postID
  return { postID }
}