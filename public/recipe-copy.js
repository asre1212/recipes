// Exact source-copy cleanup for known bundled identities; personal free text is untouched.
const changes={
 "brown-butter-miso-chocolate-chip-cookies": {
  "* The sesame note says “tsp sugar” but gives no number. Add-in amounts, oven temperature and bake time aren’t specified. The notes don’t say when to add the sesame paste or milk powder.": "Sesame sugar: tsp, amount needs confirmation. Add-in amounts, oven temperature and bake time need confirmation. When to add the sesame paste or milk powder is unclear."
 },
 "chocolate-birthday-cake": {
  "Title annotation: “less sweet than Brooklyn Blackout”.": "Less sweet than Brooklyn Blackout."
 },
 "chocolate-pie-dupe": {
  "Margin: some of the Oreo amount can be replaced with Nilla wafers.": "Some of the Oreo amount can be replaced with Nilla wafers.",
  "Small-pie note is headed “⅓ of recipe (for 1 small pie)”: 8 Oreos, 20g butter, 1 egg, 15g sugar (revised), ⅓ cup whole milk, ⅓ cup cream and 133g chocolate. These are handwritten values, not a calculated scaling.": "⅓ of recipe (for 1 small pie): 8 Oreos, 20g butter, 1 egg, 15g sugar, ⅓ cup whole milk, ⅓ cup cream and 133g chocolate.",
  "Small-pie vanilla/salt quantities are not supplied. A “half” annotation also appears near filling sugar; its scope is unclear. No extra scaling is inferred.": "Small-pie vanilla/salt quantities need confirmation. Whether “half” applies to filling sugar is unclear.",
  "chocolate shavings, mentioned in method": "chocolate shavings"
 },
 "blueberry-pie": {
  "cornstarch; no number written": "cornstarch",
  "flour; no number written": "flour",
  "Bake at 375°F for “45 min?” as written.": "Bake at 375°F for 45 minutes? Confirm bake duration.",
  "Title annotation appears to read “Mini”.": "",
  "Blueberries are named only in the title: their amount is missing. Crust and assembly method are not supplied. The written bake duration is explicitly questioned in the notebook.": "Blueberry amount, crust and assembly method need confirmation. Bake duration is uncertain."
 },
 "baked-pb-banana-oats": {
  "oats, as written": "oats"
 },
 "zucchini-bread": {
  "Yield note: 2 mini loaves.": "Yield: 2 mini loaves."
 },
 "chocolate-pecan-pie": {
  "sugar (original 25g noted)": "sugar (alternate amount: 25g)",
  "Custard margin arrows also show 130g near dark brown sugar and 140g near maple syrup; the main list shows 60g sugar and 50–60g syrup. Neither alternative has been chosen silently.": "Custard alternatives: 130g dark brown sugar and 140g maple syrup, compared with 60g sugar and 50–60g syrup. Amounts need confirmation.",
  "dark brown sugar; also annotated 130g": "dark brown sugar; alternate amount: 130g",
  "maple syrup; also annotated 140g": "maple syrup; alternate amount: 140g"
 },
 "fortnum-mason-shortbread": {
  "Variation note: substitute 9g hojicha and use less sugar. “Optional” is crossed out next to vanilla and salt.": "Variation: substitute 9g hojicha and use less sugar. Use vanilla and salt."
 },
 "sticky-toffee-pudding": {
  "packed brown sugar; numerator overwritten": "packed brown sugar; amount needs confirmation",
  "The brown-sugar numerator is overwritten and appears to be ¾; confirm before baking. Cake bake duration, pan size and the alternate sauce-finish timing are unspecified.": "Brown sugar may be ¾ cup; confirm before baking. Cake bake duration, pan size and the alternate sauce-finish timing need confirmation."
 },
 "banana-pudding-magnolia-bakery": {
  "Dish note: 9 × 13.": "Dish: 9 × 13.",
  "Pudding preparation liquid and amounts are not listed; the source refers to the package instructions.": "Follow the package instructions for pudding preparation liquid and amounts."
 },
 "chocolate-chip-banana-bread": {
  "Chocolate chips appear in the title but no amount is listed. Mixing/assembly instructions, pan size and bake duration are not supplied.": "Chocolate chip amount, mixing/assembly instructions, pan size and bake duration need confirmation."
 },
 "chocolate-lava-cake": {
  "“Lava” is the corrected word in the handwritten title.": "",
  "The source does not give pan size, yield, bake duration or a separate espresso-addition step.": "Pan size, yield, bake duration and when to add espresso need confirmation."
 },
 "tiramisu": {
  "Ladyfinger package size, espresso volume and a separate vanilla-addition step are unspecified. Cream cheese is explicitly written; it has not been changed to mascarpone.": "Ladyfinger package size, espresso volume and when to add vanilla need confirmation."
 },
 "camp-cookies": {
  "Preheat oven to 175°C; handwritten note: 350°F. Line three baking sheets with parchment paper and set aside.": "Preheat oven to 350°F / 175°C. Line three baking sheets with parchment paper and set aside.",
  "Handwritten half batch: 250g butter, 250g sugar, 1 egg, 275g flour, 5g baking soda, 2.5g salt and 200g cornflakes.": "Half batch: 250g butter, 250g sugar, 1 egg, 275g flour, 5g baking soda, 2.5g salt and 200g cornflakes.",
  "Cake-flour substitution note: 275g = 234g regular flour + 41g cornstarch.": "Cake-flour substitution: 275g = 234g regular flour + 41g cornstarch.",
  "Cornflakes are noted as “in crust”; a following word is crossed out.": "Cornflakes: in crust.",
  "The printed method mentions baking powder, but the ingredient list supplies no baking-powder quantity. A revised sugar note beside 250g is unclear; no replacement amount has been inferred.": "Baking powder quantity needs confirmation. The alternate sugar amount near 250g is unclear."
 },
 "shrimp-marinade": {
  "A separately titled marinade on the same notebook page as Spring roll shrimp and Crab Cakes.": "",
  "No quantities or method are supplied. “Garlic cubes” is retained as written; it has not been changed to cloves.": "Quantities and method need confirmation."
 },
 "milk-bread": {
  "bread flour, as written": "bread flour",
  "sugar, revised from crossed-out ¼ cup (60g)": "sugar; alternate amount: ¼ cup (60g)",
  "salt, as written": "salt",
  "The cup and gram amounts for bread flour and salt are copied as written; they have not been reconciled.": "Cup and gram amounts for bread flour and salt may differ; verify before using.",
  "The yeast line is heavily revised: “2 tsp” appears above the crossed-out original amount, and “instant yeast” remains legible. Dry milk powder amount and pan size are not specified.": "Instant yeast may be 2 tsp; confirm the amount. Dry milk powder amount and pan size need confirmation.",
  "instant yeast; revised amount needs confirmation": "instant yeast; amount needs confirmation",
  "warm water, as written": "warm water"
 },
 "copycat-mary-os-irish-soda-bread-scones": {
  "Title annotation: “My edit”.": "",
  "Egg-wash quantities and muffin-tin size are unspecified. The alternate buttermilk note says “milk + ½ tsp lemon juice”; no separate milk quantity is given.": "Egg-wash quantities and muffin-tin size need confirmation. Buttermilk alternative: milk + ½ tsp lemon juice; milk quantity needs confirmation."
 },
 "sourdough": {
  "The bake note reads: “475°F oven: 450°F for 25 min w/lid on then 425°F for 30 min w/lid off.”": "475°F oven: 450°F for 25 min w/lid on then 425°F for 30 min w/lid off."
 },
 "sourdough-discard-scones": {
  "sugar; handwriting needs confirmation": "sugar; amount needs confirmation",
  "Butter substitution margin reads “0.75% butter aka ⅜ cup & rest 0.25% Greek yogurt”; preserved as a note, not calculated.": "Butter substitution: 0.75% butter aka ⅜ cup & rest 0.25% Greek yogurt.",
  "The last word of the overwritten title appears to be “scones”; confirm it. Sugar appears to read “¼ tbsp”, which is unusual but is not silently corrected. Added vanilla/sugar and yogurt quantities are not fully specified; the egg-wash application step is not written.": "Sugar may be ¼ tbsp; confirm the amount. Added vanilla/sugar and yogurt quantities and when to apply egg wash need confirmation."
 },
 "flaky-pie-crust": {
  "A separate “(8)” is written beside the 10 tbsp butter line; its meaning is unclear.": "Butter quantity needs confirmation: 10 tbsp, with an unclear alternate “(8)”.",
  "Double batch, as written": "Double batch"
 },
 "basic-quiche-recipe": {
  "crust, mentioned in method": "crust"
 }
};
export function readerCopy(recipe){
 const replacements=changes[recipe.id];if(!replacements)return recipe;
 const clean=value=>typeof value==='string'?(replacements[value]??value):Array.isArray(value)?value.map(clean):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,v])=>[key,clean(v)])):value;
 const result=clean(recipe);result.notes=result.notes.filter(Boolean);return result;
}
