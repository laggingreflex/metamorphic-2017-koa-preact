import { arrayEqual } from 'app/utils';

export default (taxonomy, taxonomySelected, hierarchySelected) => Object.entries(taxonomy || {}).reduce((list, [key, entry]) => {
  if (!entry || entry.delete) {
    return list;
  }

  if (entry.taxonomy !== taxonomySelected) {
    return list;
  }

  const hierarchy = entry.hierarchy;

  if (!hierarchy.reduce((r, h) => r && !(taxonomy[h] && taxonomy[h].delete), true)) {
    return list;
  }

  if (hierarchySelected.length < hierarchy.length) {
    return list;
  }
  if (!arrayEqual(hierarchy, hierarchySelected)) {
    return list;
  }
  const nHierarchy = [...hierarchy, key];
  const isExpanded = nHierarchy > hierarchySelected ? false : arrayEqual(nHierarchy, hierarchySelected);
  if (!list[hierarchy.length]) {
    list[hierarchy.length] = [];
  }
  list[hierarchy.length].push([key, entry, { isExpanded, nHierarchy }]);
  return list;
}, []);
