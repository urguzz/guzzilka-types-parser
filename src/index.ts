import { xml2js } from 'xml-js';
import { readFileSync, writeFileSync } from 'fs';

const xml = readFileSync('src/types.xml', 'utf8');
const js = xml2js(xml, { ignoreComment: true, alwaysChildren: true });
const types = js.elements[0].elements;

const names = types.flatMap(({ attributes }: any) => attributes.name);

const categories = [
  ...new Set<string>(
    types
      .flatMap(({ elements }: any) => elements.find(({ name }: any) => name === 'category')?.attributes.name)
      .filter(Boolean),
  ),
];

const categoryMap = new Map<string, string[]>();
types
  .map(({ attributes, elements }: any) => ({
    name: attributes.name,
    category: elements.find(({ name }: any) => name === 'category')?.attributes.name,
  }))
  .forEach(({ name, category }: any) =>
    categoryMap.has(category) ? categoryMap.get(category)?.push(name) : categoryMap.set(category, [name]),
  );
const namesAndCategories = Object.fromEntries(categoryMap.entries());

writeFileSync('./names.json', JSON.stringify(names));
writeFileSync('./categories.json', JSON.stringify(categories));
writeFileSync('./names-and-categories.json', JSON.stringify(namesAndCategories));
