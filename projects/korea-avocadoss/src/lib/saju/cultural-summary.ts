import type {FiveElementsElement} from './input-contracts';
import type {SajuExperienceResult} from './experience';

export type ElementBalanceSummary={
  dominant:FiveElementsElement[];
  lessRepresented:FiveElementsElement[];
  spread:number;
  knownValues:Partial<Record<FiveElementsElement,number>>;
};

const ELEMENTS:FiveElementsElement[]=['wood','fire','earth','metal','water'];

/**
 * Describes only the symbolic distribution already present in the deterministic
 * chart. It deliberately does not infer personality, compatibility, health,
 * wealth, future events, or other life outcomes.
 */
export function summarizeElementBalance(result:SajuExperienceResult):ElementBalanceSummary{
  const source=result.fiveElements.exact??result.fiveElements.base;
  const values=ELEMENTS.map(key=>({key,value:Number(source[key]??0)}));
  const max=Math.max(...values.map(item=>item.value));
  const min=Math.min(...values.map(item=>item.value));
  return{
    dominant:values.filter(item=>item.value===max&&max>0).map(item=>item.key),
    lessRepresented:values.filter(item=>item.value===min).map(item=>item.key),
    spread:max-min,
    knownValues:Object.fromEntries(values.map(item=>[item.key,item.value])) as Partial<Record<FiveElementsElement,number>>,
  };
}
