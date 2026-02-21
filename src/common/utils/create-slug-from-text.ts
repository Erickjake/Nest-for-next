import { generateRandomSuffix } from './generate-random-suffix';
import { slugify } from './slugify';

export function createSlugFromText(text: string) {
  const slugifiedText = slugify(text);
  const randomSuffix = generateRandomSuffix();
  return `${slugifiedText}-${randomSuffix}`;
}
