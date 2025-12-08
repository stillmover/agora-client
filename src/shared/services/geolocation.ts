import { Region } from "@/shared/api/gql";
import { logger } from "./logger";

const countryCodeToRegion: Record<string, Region> = {
  US: Region.NorthAmerica,
  CA: Region.NorthAmerica,
  MX: Region.NorthAmerica,
  GT: Region.NorthAmerica,
  BZ: Region.NorthAmerica,
  SV: Region.NorthAmerica,
  HN: Region.NorthAmerica,
  NI: Region.NorthAmerica,
  CR: Region.NorthAmerica,
  PA: Region.NorthAmerica,
  CU: Region.NorthAmerica,
  JM: Region.NorthAmerica,
  HT: Region.NorthAmerica,
  DO: Region.NorthAmerica,
  PR: Region.NorthAmerica,
  TT: Region.NorthAmerica,
  BB: Region.NorthAmerica,
  GD: Region.NorthAmerica,
  LC: Region.NorthAmerica,
  VC: Region.NorthAmerica,
  AG: Region.NorthAmerica,
  KN: Region.NorthAmerica,
  DM: Region.NorthAmerica,
  BS: Region.NorthAmerica,
  BR: Region.SouthAmerica,
  AR: Region.SouthAmerica,
  CO: Region.SouthAmerica,
  PE: Region.SouthAmerica,
  VE: Region.SouthAmerica,
  CL: Region.SouthAmerica,
  EC: Region.SouthAmerica,
  BO: Region.SouthAmerica,
  PY: Region.SouthAmerica,
  UY: Region.SouthAmerica,
  GY: Region.SouthAmerica,
  SR: Region.SouthAmerica,
  GF: Region.SouthAmerica,
  FK: Region.SouthAmerica,
  GB: Region.Europe,
  FR: Region.Europe,
  DE: Region.Europe,
  IT: Region.Europe,
  ES: Region.Europe,
  PL: Region.Europe,
  NL: Region.Europe,
  BE: Region.Europe,
  GR: Region.Europe,
  PT: Region.Europe,
  CZ: Region.Europe,
  RO: Region.Europe,
  HU: Region.Europe,
  SE: Region.Europe,
  AT: Region.Europe,
  BG: Region.Europe,
  DK: Region.Europe,
  FI: Region.Europe,
  SK: Region.Europe,
  IE: Region.Europe,
  HR: Region.Europe,
  LT: Region.Europe,
  SI: Region.Europe,
  LV: Region.Europe,
  EE: Region.Europe,
  CY: Region.Europe,
  LU: Region.Europe,
  MT: Region.Europe,
  IS: Region.Europe,
  NO: Region.Europe,
  CH: Region.Europe,
  RU: Region.Europe,
  UA: Region.Europe,
  BY: Region.Europe,
  MD: Region.Europe,
  RS: Region.Europe,
  BA: Region.Europe,
  MK: Region.Europe,
  AL: Region.Europe,
  ME: Region.Europe,
  XK: Region.Europe,
  CN: Region.Asia,
  IN: Region.Asia,
  ID: Region.Asia,
  PK: Region.Asia,
  BD: Region.Asia,
  JP: Region.Asia,
  PH: Region.Asia,
  VN: Region.Asia,
  TH: Region.Asia,
  MY: Region.Asia,
  KR: Region.Asia,
  HK: Region.Asia,
  MM: Region.Asia,
  AF: Region.Asia,
  IQ: Region.Asia,
  SA: Region.Asia,
  UZ: Region.Asia,
  YE: Region.Asia,
  NP: Region.Asia,
  TW: Region.Asia,
  LK: Region.Asia,
  KH: Region.Asia,
  JO: Region.Asia,
  AZ: Region.Asia,
  AE: Region.Asia,
  TJ: Region.Asia,
  LA: Region.Asia,
  SY: Region.Asia,
  IL: Region.Asia,
  KG: Region.Asia,
  GE: Region.Asia,
  TM: Region.Asia,
  SG: Region.Asia,
  MN: Region.Asia,
  OM: Region.Asia,
  KW: Region.Asia,
  QA: Region.Asia,
  BH: Region.Asia,
  AM: Region.Asia,
  LB: Region.Asia,
  BN: Region.Asia,
  MV: Region.Asia,
  BT: Region.Asia,
  NG: Region.Africa,
  ET: Region.Africa,
  EG: Region.Africa,
  CD: Region.Africa,
  TZ: Region.Africa,
  KE: Region.Africa,
  UG: Region.Africa,
  DZ: Region.Africa,
  SD: Region.Africa,
  MA: Region.Africa,
  AO: Region.Africa,
  MZ: Region.Africa,
  GH: Region.Africa,
  MG: Region.Africa,
  CM: Region.Africa,
  CI: Region.Africa,
  NE: Region.Africa,
  BF: Region.Africa,
  ML: Region.Africa,
  MW: Region.Africa,
  ZM: Region.Africa,
  SN: Region.Africa,
  TD: Region.Africa,
  SO: Region.Africa,
  ZW: Region.Africa,
  GN: Region.Africa,
  RW: Region.Africa,
  BI: Region.Africa,
  TN: Region.Africa,
  BJ: Region.Africa,
  SS: Region.Africa,
  TG: Region.Africa,
  SL: Region.Africa,
  LY: Region.Africa,
  LR: Region.Africa,
  MR: Region.Africa,
  ER: Region.Africa,
  GM: Region.Africa,
  GW: Region.Africa,
  GA: Region.Africa,
  LS: Region.Africa,
  BW: Region.Africa,
  GQ: Region.Africa,
  MU: Region.Africa,
  DJ: Region.Africa,
  RE: Region.Africa,
  KM: Region.Africa,
  EH: Region.Africa,
  SC: Region.Africa,
  CV: Region.Africa,
  ST: Region.Africa,
  AU: Region.Australia,
  NZ: Region.Australia,
  PG: Region.Australia,
  NC: Region.Australia,
  FJ: Region.Australia,
  PF: Region.Australia,
  SB: Region.Australia,
  VU: Region.Australia,
  WS: Region.Australia,
  KI: Region.Australia,
  FM: Region.Australia,
  TO: Region.Australia,
  MH: Region.Australia,
  PW: Region.Australia,
  TV: Region.Australia,
  NR: Region.Australia,
  CK: Region.Australia,
  NU: Region.Australia,
  TK: Region.Australia,
};

export type UserPlace = {
  city: string | null;
  countryCode: string;
  countryName: string | null;
  region: Region | undefined;
  displayName: string;
};

async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<{
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
}> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      { signal: AbortSignal.timeout(7000) },
    );

    if (!response.ok) {
      return { countryCode: null, countryName: null, city: null };
    }
    const data = await response.json();

    const city: string | null =
      data.city || data.locality || data.principalSubdivisionLocality || null;

    const countryCode: string | null = data.countryCode
      ? String(data.countryCode).toUpperCase()
      : null;
    const countryName: string | null = data.countryName || null;

    return { countryCode, countryName, city };
  } catch (error) {
    logger.debug("reverseGeocode failed:", error);
    return { countryCode: null, countryName: null, city: null };
  }
}

async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      enableHighAccuracy: false,
      maximumAge: 0,
    });
  });
}

export async function detectUserPlace(): Promise<UserPlace | undefined> {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    const { countryCode, countryName, city } = await reverseGeocode(
      latitude,
      longitude,
    );
    if (!countryCode) {
      return undefined;
    }

    const region = countryCodeToRegion[countryCode];

    const displayName =
      city && countryName
        ? `${city}/${countryName}`
        : countryName || countryCode;

    return {
      city,
      countryCode,
      countryName,
      region,
      displayName,
    };
  } catch (error) {
    logger.debug(
      "detectUserPlace failed (permission denied or unavailable):",
      error,
    );
    return undefined;
  }
}

export async function detectUserRegion(): Promise<Region | undefined> {
  const place = await detectUserPlace();
  return place?.region;
}

export function getRegionFromCountryCode(
  countryCode: string,
): Region | undefined {
  return countryCodeToRegion[countryCode.toUpperCase()];
}
