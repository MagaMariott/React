export const categoryOptions = [
  { value: "warning", label: "Warning" },
  { value: "prohibitory", label: "Prohibitory" },
  { value: "mandatory", label: "Mandatory" },
  { value: "information", label: "Information" },
  { value: "priority", label: "Priority" },
];

export const progressOptions = [
  { value: "all", label: "Any progress" },
  { value: "learning", label: "Still learning" },
  { value: "learned", label: "Learned" },
];

export const sortOptions = [
  { value: "name", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "code", label: "Code A–Z" },
  { value: "code-desc", label: "Code Z–A" },
];

export const shapeFor = {
  warning: "triangle",
  prohibitory: "circle",
  mandatory: "circle",
  information: "rectangle",
  priority: "diamond",
};

export function categoryLabel(value) {
  return categoryOptions.find((item) => item.value === value)?.label ?? value;
}
