import {Character} from '../../model/Character';
import '../../../shim';
import crypto from 'crypto';

const BASE_URL = 'http://gateway.marvel.com';
const DEFAULT_TIMEOUT = 1000;
const PAGE_SIZE = 10;
const ORDER_BY = 'name';

interface AuthParams {
  ts: number;
  apikey: string;
  hash: string;
}

function getAuthParams(): AuthParams {
  let ts = new Date().getTime();
  let publicKey = '******';
  let privateKey = '******';
  let parts = ts + privateKey + publicKey;
  var hash = crypto.createHash('md5').update(parts).digest('hex');

  return {
    ts: ts,
    apikey: publicKey,
    hash: hash,
  };
}
function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getCharacters(
  limit: number,
  offset: number,
): Promise<Array<Character>> {
  try {
    await timeout(DEFAULT_TIMEOUT);
    let params = getAuthParams();
    let response = await fetch(
      `${BASE_URL}/v1/public/characters?orderBy=${ORDER_BY}&limit=${limit}&offset=${offset}&apikey=${params.apikey}&ts=${params.ts}&hash=${params.hash}`,
    );
    let json = await response.json();
    const date = new Date().toISOString();
    console.log(`${date} Service limit=${limit}&offset=${offset}`);
    return json.data.results as Array<Character>;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getCharactersByName(
  name: string,
): Promise<Array<Character>> {
  try {
    await timeout(DEFAULT_TIMEOUT);
    let params = getAuthParams();
    let response = await fetch(
      `${BASE_URL}/v1/public/characters?orderBy=${ORDER_BY}&limit=${PAGE_SIZE}&apikey=${params.apikey}&ts=${params.ts}&hash=${params.hash}&nameStartsWith=${name}`,
    );
    let json = await response.json();
    return json.data.results as Array<Character>;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCharacterById(id: number): Promise<Character> {
  try {
    await timeout(DEFAULT_TIMEOUT);
    let params = getAuthParams();
    let response = await fetch(
      `${BASE_URL}/v1/public/characters/${id}?apikey=${params.apikey}&ts=${params.ts}&hash=${params.hash}`,
    );
    let json = await response.json();
    return json.data.results[0] as Character;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
