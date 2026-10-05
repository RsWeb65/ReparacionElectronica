export const useApi = () => {
  const config = useRuntimeConfig()

  const get = <T>(path: string) =>
    $fetch<T>(`${config.public.apiBase}${path}`)

  const post = <T>(path: string, body: unknown) =>
    $fetch<T>(`${config.public.apiBase}${path}`, {
      method: 'POST',
      body
    })

  const patch = <T>(path: string, body: unknown) =>
    $fetch<T>(`${config.public.apiBase}${path}`, {
      method: 'PATCH',
      body
    })

  return { get, post, patch }
}