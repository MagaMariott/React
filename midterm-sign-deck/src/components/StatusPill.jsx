const labels = {
  warning: "Warning",
  prohibitory: "Prohibitory",
  mandatory: "Mandatory",
  information: "Information",
  priority: "Priority",
};

export default function StatusPill({ category }) {
  return <span className={`pill kind-${category}`}>{labels[category] || category}</span>;
}
