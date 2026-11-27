import {saveRecipe} from './storage.js';
import {markDraft,discardDraft} from './kitchen.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const trialArrow='<svg class="trial-arrow" aria-hidden="true" viewBox="0 0 100 35"><path d="M5 20Q40 13 89 18M75 6Q85 12 94 18L76 29" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export function changeTrials(trials=[],id,ingredient,outcome){
 if(!ingredient.trim()||!outcome.trim())throw Error('Add an ingredient or amount and a free-text outcome.');
 if(ingredient.length>5000||outcome.length>20000)throw Error('Keep the ingredient under 5,000 characters and outcome under 20,000 characters.');
 if(!id&&trials.length>=100)throw Error('This recipe already has 100 trial entries.');
 const entry={id:id||'trial-'+crypto.randomUUID(),ingredient:ingredient.trim(),outcome:outcome.trim()};
 return id?trials.map(t=>t.id===id?entry:t):[...trials,entry];
}
export function trialSection(recipe){const trials=recipe.trials||[];return `<section class="prior-trials" tabindex="-1" aria-label="Prior Trials"><h2>Prior Trials</h2>${trials.length?`<ol class="trial-list">${trials.map((t,i)=>`<li><div class="trial-observation"><span class="trial-ingredient">${escape(t.ingredient)}</span>${trialArrow}<span class="trial-outcome">${escape(t.outcome)}</span></div><div class="trial-actions"><button type="button" data-edit-trial="${escape(t.id)}" aria-label="Edit trial ${i+1}">Edit</button><button type="button" data-remove-trial="${escape(t.id)}" aria-label="Remove trial ${i+1}">Remove</button></div></li>`).join('')}</ol>`:''}<button type="button" id="add-trial">Add a trial</button><div id="trial-editor"></div><p id="trial-status" role="status"></p></section>`;}
export function bindTrials(recipe,onSaved){
 const trials=recipe.trials||[];const host=document.querySelector('#trial-editor');const status=document.querySelector('#trial-status');
 const buttons=()=>document.querySelectorAll('.prior-trials>button,.trial-actions button');
 const open=id=>{const prior=trials.find(t=>t.id===id);buttons().forEach(b=>b.disabled=true);host.innerHTML=`<form id="trial-form"><h3>${prior?'Edit trial':'New trial'}</h3><label>Ingredient / amount<input name="trialIngredient" required maxlength="5000" placeholder="e.g. 1 cup sugar" value="${escape(prior?.ingredient||'')}"></label><label>Outcome<textarea name="trialOutcome" required maxlength="20000" rows="3" placeholder="e.g. too sweet">${escape(prior?.outcome||'')}</textarea></label><div class="trial-form-actions"><button type="submit">Save trial</button><button type="button" id="cancel-trial">Cancel trial</button></div></form>`;
 const form=document.querySelector('#trial-form');form.elements.trialIngredient.focus();form.addEventListener('input',markDraft);
 document.querySelector('#cancel-trial').addEventListener('click',()=>{discardDraft();host.replaceChildren();buttons().forEach(b=>b.disabled=false);document.querySelector('#add-trial').focus();});
 form.addEventListener('submit',async event=>{event.preventDefault();const submit=form.querySelector('[type=submit]');submit.disabled=true;try{const next=changeTrials(trials,id,form.elements.trialIngredient.value,form.elements.trialOutcome.value);await saveRecipe({...recipe,trials:next});discardDraft();await onSaved();}catch(error){status.textContent=error.message||'Could not save this trial. Your draft is still here.';submit.disabled=false;}});
 };
 document.querySelector('#add-trial').addEventListener('click',()=>open(null));
 document.querySelectorAll('[data-edit-trial]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.editTrial)));
 document.querySelectorAll('[data-remove-trial]').forEach(button=>button.addEventListener('click',async()=>{if(!confirm('Remove this Prior Trials entry? The recipe ingredients and method will be kept.'))return;button.disabled=true;try{await saveRecipe({...recipe,trials:trials.filter(t=>t.id!==button.dataset.removeTrial)});await onSaved();}catch{status.textContent='Could not remove this trial. It remains saved on this device.';button.disabled=false;}}));
}
