import axios from "axios";

async function getGoogleUserInfo(accessToken: string) {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const {
    email,
    picture: profile,
    name,
    sub: providerIdFromToken,
  } = response.data;
  return { email, profile, name, providerIdFromToken };
}

export async function getUserInfoFromGoogleProvider(
  provider: string,
  token: string
) {
  if (provider === "google") return getGoogleUserInfo(token);
  throw new Error(`Provider '${provider}' not supported`);
}
