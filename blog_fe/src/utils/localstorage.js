export const getToken = () => {
  const userStr = window.localStorage.getItem('user')
  const userJson = JSON.parse(userStr)
  return `bearer ${userJson.token}`
}