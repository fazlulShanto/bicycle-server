import moment, { Moment } from 'moment';
import { bicycleHealthUpgration, getAllBicycle } from '../models/bicycle/bicycle.query';
import bicycleDependency from './bicyclePartsDependency.json';
import { BicycleParts } from '../interfaces/bicycle.interface';
import { DependencyPart,Subpart } from '../interfaces/subpart.interface';
moment().format();

const damageCalculateForOnePart = (
  subpart: BicycleParts,
  dependencyPart: DependencyPart,
  pavedDistance: number,
  unpavedDistance: number,
  bicycleSubParts: BicycleParts[]
) => {
  const k = 217.147240952;
  const damage =
    Math.E ** ((dependencyPart.roadConditionFactor * (1.2 * unpavedDistance + pavedDistance)) / k);
  if (dependencyPart.dependentPartId === '') {
    subpart.health = Math.max(100 - damage, 0);
  } else {
    const dependencySubpart = bicycleSubParts.filter((bicycleSubPart) => {
      return String(bicycleSubPart.subpart._id) === dependencyPart.dependentPartId;
    });

    let CoefficientOfDamageOfFactorComponent = 1;
    if (dependencySubpart[0].health < 70 && dependencySubpart[0].health >= 40) {
      CoefficientOfDamageOfFactorComponent = 1.2;
    } else if (dependencySubpart[0].health < 40 && dependencySubpart[0].health >= 20) {
      CoefficientOfDamageOfFactorComponent = 1.4;
    } else {
      CoefficientOfDamageOfFactorComponent = 1.5;
    }

    subpart.health = Math.max(100 - CoefficientOfDamageOfFactorComponent * damage, 0);
  }
};

const calculatePartsHealth = (
  bicycleSubParts: BicycleParts[],
  dailyCommuteDays: number,
  dailyCommutetotalDistance: number,
  dailyCommutedUnpavedRoad: number,
  isRecreational: boolean,
  recreationalCommuteDays: number,
  recreationalCommutetotalDistance: number,
  recreationalCommutedActivityType: string[]
) => {
  bicycleDependency.forEach((dependencyPart) => {
    const subpart = bicycleSubParts.filter((bicycleSubPart) => {
      return String(bicycleSubPart.subpart._id) === dependencyPart._id;
    });

    if (subpart.length === 0) return;

    const lastRevisionDate = moment(subpart[0].lastMaintained);

    const totalDailyCommutedPavedDistance = getDistance(
      2,
      lastRevisionDate,
      dailyCommuteDays,
      dailyCommutetotalDistance,
      1 - dailyCommutedUnpavedRoad / 100
    );

    const totalDailyCommutedUnpavedDistance = getDistance(
      2,
      lastRevisionDate,
      dailyCommuteDays,
      dailyCommutetotalDistance,
      dailyCommutedUnpavedRoad / 100
    );

    let totalRecreationalCommutedPavedDistance = 0;
    let totalRecreationalCommutedUnpavedDistance = 0;

    let unpavedRoadFactor = 0;
    if (isRecreational) {
      if (recreationalCommutedActivityType.includes('off-road')) {
        unpavedRoadFactor = getRecreationalCommuteUnpavedFactor(
          recreationalCommutedActivityType.length
        );
      }

      totalRecreationalCommutedPavedDistance = getDistance(
        1,
        lastRevisionDate,
        recreationalCommuteDays,
        recreationalCommutetotalDistance,
        1 - unpavedRoadFactor
      );

      totalRecreationalCommutedPavedDistance = getDistance(
        1,
        lastRevisionDate,
        recreationalCommuteDays,
        recreationalCommutetotalDistance,
        unpavedRoadFactor
      );
    }

    const totalPavedDistance =
      totalDailyCommutedPavedDistance + totalRecreationalCommutedPavedDistance;
    const totalUnpavedDistance =
      totalDailyCommutedUnpavedDistance + totalRecreationalCommutedUnpavedDistance;

    damageCalculateForOnePart(
      subpart[0],
      dependencyPart,
      totalPavedDistance,
      totalUnpavedDistance,
      bicycleSubParts
    );
  });
};

const getRecreationalCommuteUnpavedFactor = (activityTypeLength: number) => {
  return 1 / activityTypeLength;
};

const getDistance = (
  way: number,
  lastMaintainedDate: Moment,
  rodeDay: number,
  rodeDistance: number,
  rideFactor: number
) => {
  return way * moment().diff(lastMaintainedDate, 'week') * rodeDay * rodeDistance * rideFactor;
};


const bicycleHealthAlgorithm = async () => {
  const allBicycle = await getAllBicycle();

  


  
  
  // return 0;
  
  allBicycle &&
    allBicycle.forEach((bicycle) => {
      let lastRevisionMonth: number = bicycle.purchaseMonth;
      let lastRevisionYear: number = bicycle.purchaseYear;

      if (bicycle.isRevised) {
        bicycle.revisionMonth && (lastRevisionMonth = bicycle.revisionMonth);
        bicycle.revisionYear && (lastRevisionYear = bicycle.revisionYear);
      }

  // console.log(`all bicycle list 1=`,allBicycle?.length);
      bicycle.bicycleParts &&
        calculatePartsHealth(
          bicycle.bicycleParts,
          bicycle.dailyCommute?.days.length,
          bicycle.dailyCommute?.totalDistance,
          bicycle.dailyCommute?.unpavedRoad,
          !!bicycle.recreationalCommute,
          bicycle.recreationalCommute!?.days.length,
          bicycle.recreationalCommute!?.lengthOfRide,
          bicycle.recreationalCommute!?.activityType
        );

      let totalSubpartHealth = 0;
      bicycle.bicycleParts!?.forEach((part) => {
        totalSubpartHealth += part?.health;
      });

      bicycle.totalHealth = totalSubpartHealth / bicycle?.bicycleParts!?.length;

      bicycleHealthUpgration(bicycle?._id, bicycle);
    });
};

export { bicycleHealthAlgorithm };
