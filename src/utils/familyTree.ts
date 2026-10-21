import type {
  FamilyTreePerson,
  FamilyTreePersonInput,
  FamilyTreeRelation,
} from '@/types';

export interface FamilyTreeUnit {
  key: string;
  people: FamilyTreePerson[];
}

export interface FamilyTreeGeneration {
  index: number;
  units: FamilyTreeUnit[];
}

export function parentIdsOf(person: FamilyTreePerson | undefined): string[] {
  if (!person?.relations) return [];
  return person.relations.filter((relation) => relation.kind === 'parent').map((relation) => relation.personId);
}

export function spouseIdOf(
  person: FamilyTreePerson | undefined,
  people: FamilyTreePerson[],
): string | undefined {
  if (!person) return undefined;
  const direct = person.relations?.find((relation) => relation.kind === 'spouse')?.personId;
  if (direct && people.some((item) => item.id === direct)) return direct;
  return people.find((other) =>
    other.relations?.some((relation) => relation.kind === 'spouse' && relation.personId === person.id),
  )?.id;
}

export function childrenOf(personId: string, people: FamilyTreePerson[]): FamilyTreePerson[] {
  return people.filter((person) => parentIdsOf(person).includes(personId));
}

function withoutRelation(
  person: FamilyTreePerson,
  predicate: (relation: FamilyTreeRelation) => boolean,
): FamilyTreePerson {
  const relations = (person.relations ?? []).filter((relation) => !predicate(relation));
  if (relations.length === 0) {
    const { relations: _removed, ...rest } = person;
    return rest;
  }
  return { ...person, relations };
}

/** True when making `parentId` a parent of `personId` would loop the tree. */
export function createsParentCycle(
  personId: string,
  parentId: string,
  people: FamilyTreePerson[],
): boolean {
  if (personId === parentId) return true;
  const seen = new Set<string>();
  const stack = [parentId];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || seen.has(current)) continue;
    if (current === personId) return true;
    seen.add(current);
    const person = people.find((item) => item.id === current);
    parentIdsOf(person).forEach((id) => stack.push(id));
  }
  return false;
}

function sanitizeLinks(
  personId: string,
  input: FamilyTreePersonInput,
  people: FamilyTreePerson[],
): { parentIds: string[]; spouseId?: string } {
  const requestedSpouse =
    input.spouseId && input.spouseId !== personId ? input.spouseId : undefined;
  const parentIds: string[] = [];

  for (const parentId of input.parentIds ?? []) {
    if (parentIds.length >= 2) break;
    if (!parentId || parentId === personId || parentIds.includes(parentId)) continue;
    if (!people.some((person) => person.id === parentId)) continue;
    if (createsParentCycle(personId, parentId, people)) continue;
    parentIds.push(parentId);
  }

  const spouseIsRelative =
    requestedSpouse != null &&
    (parentIds.includes(requestedSpouse) ||
      createsParentCycle(personId, requestedSpouse, people) ||
      createsParentCycle(requestedSpouse, personId, people));

  const spouseId =
    requestedSpouse &&
    !spouseIsRelative &&
    people.some((person) => person.id === requestedSpouse)
      ? requestedSpouse
      : undefined;

  return { parentIds, spouseId };
}

function withLinks(
  person: FamilyTreePerson,
  parentIds: string[],
  spouseId?: string,
): FamilyTreePerson {
  const relations: FamilyTreeRelation[] = [
    ...parentIds.map((id) => ({ personId: id, kind: 'parent' as const })),
    ...(spouseId ? [{ personId: spouseId, kind: 'spouse' as const }] : []),
  ];
  if (relations.length === 0) {
    const { relations: _removed, ...rest } = person;
    return rest;
  }
  return { ...person, relations };
}

export function upsertFamilyTreePerson(
  people: FamilyTreePerson[],
  person: Pick<FamilyTreePerson, 'id' | 'name' | 'age' | 'bio'>,
  input: FamilyTreePersonInput,
): FamilyTreePerson[] {
  const existing = people.find((item) => item.id === person.id);
  const base: FamilyTreePerson = existing
    ? { ...existing, name: person.name, age: person.age, bio: person.bio }
    : person;
  const pool = existing ? people : [...people, base];
  const { parentIds, spouseId } = sanitizeLinks(person.id, input, pool);

  let next = pool.map((item) =>
    item.id === person.id ? { ...item, name: person.name, age: person.age, bio: person.bio } : item,
  );

  next = next.map((item) =>
    withoutRelation(
      item,
      (relation) =>
        relation.kind === 'spouse' && (item.id === person.id || relation.personId === person.id),
    ),
  );

  if (spouseId) {
    const spouse = next.find((item) => item.id === spouseId);
    const previousSpouseId = spouse ? spouseIdOf(spouse, next) : undefined;
    next = next.map((item) => {
      if (item.id !== spouseId && item.id !== previousSpouseId) return item;
      return withoutRelation(item, (relation) => relation.kind === 'spouse');
    });
  }

  return next.map((item) => {
    if (item.id === person.id) return withLinks(item, parentIds, spouseId);
    if (spouseId && item.id === spouseId) {
      return withLinks(item, parentIdsOf(item), person.id);
    }
    return item;
  });
}

export function removeFamilyTreePerson(
  people: FamilyTreePerson[],
  id: string,
): FamilyTreePerson[] {
  return people
    .filter((person) => person.id !== id)
    .map((person) => withoutRelation(person, (relation) => relation.personId === id));
}

function generationIndex(
  personId: string,
  people: FamilyTreePerson[],
  path: Set<string>,
): number {
  if (path.has(personId)) return 0;
  const person = people.find((item) => item.id === personId);
  const parents = parentIdsOf(person).filter((id) => people.some((item) => item.id === id));
  path.add(personId);
  let index =
    parents.length === 0
      ? 0
      : 1 + Math.max(...parents.map((id) => generationIndex(id, people, path)));

  // A spouse with no recorded parents sits beside their partner, not with the eldest generation.
  if (parents.length === 0 && person) {
    const spouseId = spouseIdOf(person, people);
    const spouse = spouseId ? people.find((item) => item.id === spouseId) : undefined;
    if (spouse && parentIdsOf(spouse).length > 0) {
      index = generationIndex(spouse.id, people, path);
    }
  }

  path.delete(personId);
  return index;
}

export function layoutFamilyTree(people: FamilyTreePerson[]): FamilyTreeGeneration[] {
  const rows = new Map<number, FamilyTreePerson[]>();
  for (const person of people) {
    const index = generationIndex(person.id, people, new Set());
    const row = rows.get(index) ?? [];
    row.push(person);
    rows.set(index, row);
  }

  return [...rows.keys()]
    .sort((a, b) => a - b)
    .map((index) => {
      const row = rows.get(index) ?? [];
      const used = new Set<string>();
      const units: FamilyTreeUnit[] = [];

      for (const person of row) {
        if (used.has(person.id)) continue;
        const spouseId = spouseIdOf(person, people);
        const spouse = spouseId ? row.find((item) => item.id === spouseId) : undefined;
        if (spouse && !used.has(spouse.id)) {
          used.add(person.id);
          used.add(spouse.id);
          const ordered = [person, spouse].sort(
            (a, b) => people.findIndex((item) => item.id === a.id) - people.findIndex((item) => item.id === b.id),
          );
          units.push({ key: ordered.map((item) => item.id).join('-'), people: ordered });
        } else {
          used.add(person.id);
          units.push({ key: person.id, people: [person] });
        }
      }

      return { index, units };
    });
}

const GENERATION_NUMERALS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

export function generationLabel(index: number): string {
  const number = index + 1;
  const cantonese = number <= 10 ? `第${GENERATION_NUMERALS[number]}代` : `第${number}代`;
  return `${cantonese} · Generation ${number}`;
}
