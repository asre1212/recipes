// Reading normalization is deliberately separate from persistence and editing.
// Exact legacy metadata replacements avoid exposing old boilerplate as a new user note.
const legacyDetails=new Map([
 ['Pan dimensions and the oven temperature unit are not specified. Keep the cake and frosting together.','Pan dimensions are not specified. Keep the cake and frosting together.'],
 ['Small-pie vanilla/salt quantities and crust temperature unit are not supplied. A “half” annotation also appears near filling sugar; its scope is unclear. No extra scaling is inferred.','Small-pie vanilla/salt quantities are not supplied. A “half” annotation also appears near filling sugar; its scope is unclear. No extra scaling is inferred.'],
 ['Blueberries are named only in the title: their amount is missing. Crust, assembly method and temperature unit are not supplied. The written bake duration is explicitly questioned in the notebook.','Blueberries are named only in the title: their amount is missing. Crust and assembly method are not supplied. The written bake duration is explicitly questioned in the notebook.'],
 ['Baking duration, mini-loaf pan dimensions and oven temperature unit are unspecified.','Baking duration and mini-loaf pan dimensions are unspecified.'],
 ['Custard sugar and syrup revisions need confirmation. Pan size and oven temperature unit are unspecified.','Custard sugar and syrup revisions need confirmation. Pan size is unspecified.'],
 ['The hojicha substitution target and reduced sugar quantity are unclear. Bake duration and temperature unit are not supplied.','The hojicha substitution target and reduced sugar quantity are unclear. Bake duration is not supplied.'],
 ['Bundt pan dimensions and oven temperature unit are not specified.','Bundt pan dimensions are not specified.'],
 ['The yeast line is heavily revised: “2 tsp” appears above the crossed-out original amount, and “instant yeast” remains legible. Dry milk powder amount, pan size and oven temperature unit are not specified.','The yeast line is heavily revised: “2 tsp” appears above the crossed-out original amount, and “instant yeast” remains legible. Dry milk powder amount and pan size are not specified.'],
 ['The exact meaning of “475 oven” and all temperature units need confirmation. Stretch/fold schedule, bulk fermentation duration, shaping and proofing details are not supplied. Variation quantities are unspecified.','The exact meaning of “475°F oven” needs confirmation. Stretch/fold schedule, bulk fermentation duration, shaping and proofing details are not supplied. Variation quantities are unspecified.'],
 ['Bake duration, pan type/size and oven temperature unit are not supplied.','Bake duration and pan type/size are not supplied.'],
 ['Base quantities, crust amount/type, pan size and temperature units are not specified.','Base quantities, crust amount/type and pan size are not specified.']
]);
export function temperatureText(value){
 if(typeof value!=='string')return value;
 let text=legacyDetails.get(value)??value;
 // Preserve both explicitly supplied scales (including the CAMP COOKIES annotation).
 text=text.replace(/(\d+(?:\.\d+)?)\s*(°|degrees?\b)(?!\s*(?:[FC]\b|Celsius\b|Fahrenheit\b))/gi,(match,number,mark,offset)=>/\b(?:turn|rotate|rotation|angle)\b/i.test(text.slice(Math.max(0,offset-24),offset)+text.slice(offset+match.length,offset+match.length+16))?match:number+'°F');
 // Bare numerals are temperatures only in an explicit oven/baking context.
 text=text.replace(/(\b(?:preheat|heat|set)\s+(?:the\s+)?oven\s+to\s+|\b(?:bake|roast)\s+at\s+)(\d{2,3}(?:\s*[–−-]\s*\d{2,3})?)(?=\s+(?:for|until)\b|[.,;!]|$)/gi,'$1$2°F');
 text=text.replace(/\b(\d{2,3})\s+oven\b/gi,'$1°F oven');
 // This exact legacy note identifies three oven settings; its time numerals stay intact.
 text=text.replace('475°F oven: 450 for 25 min w/lid on then 425 for 30 min w/lid off.','475°F oven: 450°F for 25 min w/lid on then 425°F for 30 min w/lid off.');
 if(/\d\s*°[FC]\b/i.test(text))text=text.replace(/\s*\((?:temperature )?unit (?:not written|unspecified|not specified)\)/gi,'');
 return text;
}
export function readerTemperatures(recipe){
 const pair=items=>items.map(row=>row.map(temperatureText));
 return {...recipe,ingredients:pair(recipe.ingredients),steps:recipe.steps.map(temperatureText),notes:recipe.notes.map(temperatureText),unspecified:temperatureText(recipe.unspecified),components:(recipe.components||[]).map(c=>({...c,ingredients:pair(c.ingredients),...(c.steps?{steps:c.steps.map(temperatureText)}:{})})),trials:(recipe.trials||[]).map(t=>({...t,ingredient:temperatureText(t.ingredient),outcome:temperatureText(t.outcome)}))};
}
