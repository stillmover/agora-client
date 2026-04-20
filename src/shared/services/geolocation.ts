import { Region } from "@/shared/api/gql";
import { logger } from "./logger";

const countryCodeToRegion: Record<string, Region> = {
  AE: Region.Asia,
  AF: Region.Asia,
  AG: Region.NorthAmerica,
  AL: Region.Europe,
  AM: Region.Asia,
  AO: Region.Africa,
  AR: Region.SouthAmerica,
  AT: Region.Europe,
  AU: Region.Australia,
  AZ: Region.Asia,
  BA: Region.Europe,
  BB: Region.NorthAmerica,
  BD: Region.Asia,
  BE: Region.Europe,
  BF: Region.Africa,
  BG: Region.Europe,
  BH: Region.Asia,
  BI: Region.Africa,
  BJ: Region.Africa,
  BN: Region.Asia,
  BO: Region.SouthAmerica,
  BR: Region.SouthAmerica,
  BS: Region.NorthAmerica,
  BT: Region.Asia,
  BW: Region.Africa,
  BY: Region.Europe,
  BZ: Region.NorthAmerica,
  CA: Region.NorthAmerica,
  CD: Region.Africa,
  CH: Region.Europe,
  CI: Region.Africa,
  CK: Region.Australia,
  CL: Region.SouthAmerica,
  CM: Region.Africa,
  CN: Region.Asia,
  CO: Region.SouthAmerica,
  CR: Region.NorthAmerica,
  CU: Region.NorthAmerica,
  CV: Region.Africa,
  CY: Region.Europe,
  CZ: Region.Europe,
  DE: Region.Europe,
  DJ: Region.Africa,
  DK: Region.Europe,
  DM: Region.NorthAmerica,
  DO: Region.NorthAmerica,
  DZ: Region.Africa,
  EC: Region.SouthAmerica,
  EE: Region.Europe,
  EG: Region.Africa,
  EH: Region.Africa,
  ER: Region.Africa,
  ES: Region.Europe,
  ET: Region.Africa,
  FI: Region.Europe,
  FJ: Region.Australia,
  FK: Region.SouthAmerica,
  FM: Region.Australia,
  FR: Region.Europe,
  GA: Region.Africa,
  GB: Region.Europe,
  GD: Region.NorthAmerica,
  GE: Region.Asia,
  GF: Region.SouthAmerica,
  GH: Region.Africa,
  GM: Region.Africa,
  GN: Region.Africa,
  GQ: Region.Africa,
  GR: Region.Europe,
  GT: Region.NorthAmerica,
  GW: Region.Africa,
  GY: Region.SouthAmerica,
  HK: Region.Asia,
  HN: Region.NorthAmerica,
  HR: Region.Europe,
  HT: Region.NorthAmerica,
  HU: Region.Europe,
  ID: Region.Asia,
  IE: Region.Europe,
  IL: Region.Asia,
  IN: Region.Asia,
  IQ: Region.Asia,
  IS: Region.Europe,
  IT: Region.Europe,
  JM: Region.NorthAmerica,
  JO: Region.Asia,
  JP: Region.Asia,
  KE: Region.Africa,
  KG: Region.Asia,
  KH: Region.Asia,
  KI: Region.Australia,
  KM: Region.Africa,
  KN: Region.NorthAmerica,
  KR: Region.Asia,
  KW: Region.Asia,
  LA: Region.Asia,
  LB: Region.Asia,
  LC: Region.NorthAmerica,
  LK: Region.Asia,
  LR: Region.Africa,
  LS: Region.Africa,
  LT: Region.Europe,
  LU: Region.Europe,
  LV: Region.Europe,
  LY: Region.Africa,
  MA: Region.Africa,
  MD: Region.Europe,
  ME: Region.Europe,
  MG: Region.Africa,
  MH: Region.Australia,
  MK: Region.Europe,
  ML: Region.Africa,
  MM: Region.Asia,
  MN: Region.Asia,
  MR: Region.Africa,
  MT: Region.Europe,
  MU: Region.Africa,
  MV: Region.Asia,
  MW: Region.Africa,
  MX: Region.NorthAmerica,
  MY: Region.Asia,
  MZ: Region.Africa,
  NC: Region.Australia,
  NE: Region.Africa,
  NG: Region.Africa,
  NI: Region.NorthAmerica,
  NL: Region.Europe,
  NO: Region.Europe,
  NP: Region.Asia,
  NR: Region.Australia,
  NU: Region.Australia,
  NZ: Region.Australia,
  OM: Region.Asia,
  PA: Region.NorthAmerica,
  PE: Region.SouthAmerica,
  PF: Region.Australia,
  PG: Region.Australia,
  PH: Region.Asia,
  PK: Region.Asia,
  PL: Region.Europe,
  PR: Region.NorthAmerica,
  PT: Region.Europe,
  PW: Region.Australia,
  PY: Region.SouthAmerica,
  QA: Region.Asia,
  RE: Region.Africa,
  RO: Region.Europe,
  RS: Region.Europe,
  RU: Region.Europe,
  RW: Region.Africa,
  SA: Region.Asia,
  SB: Region.Australia,
  SC: Region.Africa,
  SD: Region.Africa,
  SE: Region.Europe,
  SG: Region.Asia,
  SI: Region.Europe,
  SK: Region.Europe,
  SL: Region.Africa,
  SN: Region.Africa,
  SO: Region.Africa,
  SR: Region.SouthAmerica,
  SS: Region.Africa,
  ST: Region.Africa,
  SV: Region.NorthAmerica,
  SY: Region.Asia,
  TD: Region.Africa,
  TG: Region.Africa,
  TH: Region.Asia,
  TJ: Region.Asia,
  TK: Region.Australia,
  TM: Region.Asia,
  TN: Region.Africa,
  TO: Region.Australia,
  TT: Region.NorthAmerica,
  TV: Region.Australia,
  TW: Region.Asia,
  TZ: Region.Africa,
  UA: Region.Europe,
  UG: Region.Africa,
  US: Region.NorthAmerica,
  UY: Region.SouthAmerica,
  UZ: Region.Asia,
  VC: Region.NorthAmerica,
  VE: Region.SouthAmerica,
  VN: Region.Asia,
  VU: Region.Australia,
  WS: Region.Australia,
  XK: Region.Europe,
  YE: Region.Asia,
  ZM: Region.Africa,
  ZW: Region.Africa,
};

export interface UserPlace {
  city: string | null;
  countryCode: string;
  countryName: string | null;
  region: Region | undefined;
  displayName: string;
}

async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
}> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      { signal: AbortSignal.timeout(7000) }
    );

    if (!response.ok) {
      return { city: undefined, countryCode: undefined, countryName: undefined };
    }
    const data = await response.json();

    const city: string | null =
      data.city || data.locality || data.principalSubdivisionLocality || undefined;

    const countryCode: string | null = data.countryCode
      ? String(data.countryCode).toUpperCase()
      : undefined;
    const countryName: string | null = data.countryName || undefined;

    return { city, countryCode, countryName };
  } catch (error) {
    logger.debug("reverseGeocode failed:", error);
    return { city: undefined, countryCode: undefined, countryName: undefined };
  }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: 10_000,
    });
  });
}

export async function detectUserPlace(): Promise<UserPlace | null> {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    const { countryCode, countryName, city } = await reverseGeocode(latitude, longitude);
    if (!countryCode) {
      return;
    }

    const region = countryCodeToRegion[countryCode];

    const displayName = city && countryName ? `${city}/${countryName}` : countryName || countryCode;

    return {
      city,
      countryCode,
      countryName,
      displayName,
      region,
    };
  } catch (error) {
    logger.debug("detectUserPlace failed (permission denied or unavailable):", error);
    return;
  }
}

export async function detectUserRegion(): Promise<Region | undefined> {
  const place = await detectUserPlace();
  return place?.region;
}

export function getRegionFromCountryCode(countryCode: string): Region | undefined {
  return countryCodeToRegion[countryCode.toUpperCase()];
}
