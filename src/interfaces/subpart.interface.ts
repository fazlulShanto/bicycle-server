interface Subpart {
  name: string;
  Price: number;
  depreciationRate: number;
  category: string;
}

interface DependencyPart {
  _id: string;
  name: string;
  roadConditionFactor: number;
  dependentPartId: string;
  dependentPartName: string;
}

export { Subpart, DependencyPart };
