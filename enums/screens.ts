const baseScreenPath = '/(screens)';

export const enum AppScreen {
  Login = `${baseScreenPath}/auth/LoginScreen`,
  VerifyEmail = `${baseScreenPath}/auth/RegisterInitScreen`,
  Tabs = '/(tabs)',
  SearchResult = `${baseScreenPath}/search/SearchResultScreen`,
}

// const errorScreenPath = `${baseScreenPath}/errors`;
//
// export const enum ErrorScreen {
//   NetworkError = `${errorScreenPath}/NetworkError`,
//   InternalServerError = `${errorScreenPath}/InternalServerError`,
//   Forbidden = `${errorScreenPath}/Forbidden`,
//   TimeoutError = `${errorScreenPath}/TimeoutError`,
//   BadRequest = `${errorScreenPath}/BadRequest`,
// }
