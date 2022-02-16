export const loggedInState = {
  isLoggedIn() { return localStorage.getItem('isLoggedIn') === 'true' },
  setIsLoggedIn(state: boolean) {
    localStorage.setItem('isLoggedIn', state ? 'true' : 'false')
  },
}
