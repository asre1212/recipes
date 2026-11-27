// Display-only art and transcription cleanup. Never written into personal recipes.
export const recipeArt=Object.freeze({
 'brown-butter-miso-chocolate-chip-cookies':{src:'assets/cookies-graphite.webp',alt:'Two shaded chocolate-chip cookies',placement:'right',size:'medium',width:1024,height:683},
 'pistachio-olive-oil-cake':{src:'assets/cake-graphite.webp',alt:'A sliced pistachio cake',placement:'right',size:'medium',width:1024,height:683},
 'milk-bread':{src:'assets/bread-graphite.webp',alt:'A soft milk-bread loaf and slice',placement:'right',size:'medium',width:1024,height:683},
 'crab-cakes':{src:'assets/crab-character-graphite.webp',alt:'A cheerful big-eyed crab raising a claw',placement:'next-left',size:'compact',width:720,height:720,tilt:-30},
 'zucchini-bread':{src:'assets/zucchini-pair-graphite.webp',alt:'Two smiling zucchinis leaping with outstretched hands',placement:'left',size:'large',width:720,height:720},
 'sourdough-discard-naan':{src:'assets/naan-graphite.webp',alt:'Two overlapping blistered naan flatbreads',placement:'between',size:'wide',width:720,height:720},
 'fortnum-mason-shortbread':{src:'assets/shortbread-big-ben-graphite.webp',alt:'Elizabeth Tower with its clock face and Gothic spire',placement:'next-right',size:'tower',width:720,height:1080,companion:{src:'assets/shortbread-bearskin-graphite.webp',alt:'A tall rounded bearskin cap with shaded fur',width:480,height:480}},
 'camp-cookies':{src:'assets/camp-elephants-graphite.webp',alt:'Two elephants together, the larger holding grass in its trunk',placement:'next-right',size:'elephants',width:720,height:720,tilt:0},
 'spring-roll-shrimp':{src:'assets/shrimp-rolls-graphite.webp',alt:'Crisp shrimp rolls with visible tails',placement:'next-right',size:'side-food',width:720,height:720}
});
const transcriptionNotes=new Set(['Title annotation appears to read “Mini”.','“Lava” is the corrected word in the handwritten title.','A separately titled marinade on the same notebook page as Spring roll shrimp and Crab Cakes.','The cup and gram amounts for bread flour and salt are copied as written; they have not been reconciled.']);
export function readerNotes(recipe){return recipe.notes.filter(note=>!transcriptionNotes.has(note)).map(note=>note==='Add sesame paste and toasted black sesame, ground with sugar.*'?'Add sesame paste and toasted black sesame, ground with sugar.':note);}
export function readerIngredients(items,original=[]){return items.map(([amount,name])=>{const supplied=original.some(pair=>pair[0]===amount&&pair[1]===name);if(/^Unspecified(?: tbsp)?$/i.test(amount))amount='';if(supplied){if(amount==='1 egg + unspecified milk')amount='1 egg + milk';if(name==='cornstarch; no number written')name='cornstarch';if(name==='flour; no number written')name='flour';}return [amount,name];});}
export function readerUncertainty(recipe,original){return recipe.unspecified&&recipe.unspecified!==original?.unspecified?recipe.unspecified:'';}
