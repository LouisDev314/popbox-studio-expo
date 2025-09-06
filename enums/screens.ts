const baseScreenPath = '/(screens)';

export const enum AppScreen {
  Tabs = '/(tabs)',
  Login = `${baseScreenPath}/auth/LoginScreen`,
  VerifyEmail = `${baseScreenPath}/auth/RegisterInitScreen`,
  ProductDetail = `${baseScreenPath}/products/[id]`,
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
