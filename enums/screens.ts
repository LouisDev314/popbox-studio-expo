const baseScreenPath = '/(screens)';

export const enum AppScreen {
  Login = `${baseScreenPath}/auth/login`,
  VerifyEmail = `${baseScreenPath}/auth/register`,
  Tabs = '/(tabs)',
  Otp = `${baseScreenPath}/auth/otp`,
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
