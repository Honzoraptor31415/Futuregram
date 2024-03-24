export async function load({ params }: any) {
  const user = params.user
  return {
    user: user
  }
}